package com.cerberus.services

import com.cerberus.models.*
import io.ktor.websocket.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.io.File
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap
import org.slf4j.LoggerFactory

/**
 * Service for managing camera streams
 */
interface CameraStreamService {
    /**
     * Request a stream for a camera
     *
     * @param camera The camera to stream
     * @param sessionId Unique identifier for the client session
     * @param session WebSocket session for the client
     * @return Response with stream details or error
     */
    suspend fun requestStream(camera: Camera, sessionId: String, session: WebSocketSession): CameraStreamResponse

    /**
     * Disconnect a session from a stream
     *
     * @param streamId ID of the stream
     * @param sessionId ID of the client session
     * @return true if the session was disconnected, false otherwise
     */
    suspend fun disconnectSession(streamId: String, sessionId: String): Boolean

    /**
     * Disconnect all sessions for a client
     *
     * @param sessionId ID of the client session
     */
    suspend fun disconnectAllSessions(sessionId: String)

    /**
     * Get a stream by ID
     *
     * @param streamId ID of the stream
     * @return The stream, or null if not found
     */
    fun getStream(streamId: String): CameraStream?

    /**
     * Get all active streams
     *
     * @return Map of stream IDs to streams
     */
    fun getAllStreams(): Map<String, CameraStream>
}

/**
 * Implementation of CameraStreamService
 */
class CameraStreamServiceImpl(
    private val lockService: DistributedLockService
) : CameraStreamService {
    private val logger = LoggerFactory.getLogger(CameraStreamServiceImpl::class.java)

    // Map of stream IDs to active streams
    private val activeStreams = ConcurrentHashMap<String, CameraStream>()

    // Map of camera IDs to stream IDs
    private val cameraStreamMap = ConcurrentHashMap<String, String>()

    // Map of session IDs to sets of stream IDs
    private val sessionStreams = ConcurrentHashMap<String, MutableSet<String>>()

    // Unique ID for this service instance (pod)
    private val podId = UUID.randomUUID().toString()

    // Coroutine scope for async operations
    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    init {
        logger.info("CameraStreamServiceImpl initialized with pod ID: $podId")

        // Start a periodic task to renew locks for active streams
        serviceScope.launch {
            while (true) {
                try {
                    renewActiveLocks()
                    delay(30000) // 30 seconds
                } catch (e: Exception) {
                    logger.error("Error renewing locks", e)
                }
            }
        }
    }

    /**
     * Renew locks for all active streams owned by this pod
     */
    private suspend fun renewActiveLocks() {
        for ((cameraId, streamId) in cameraStreamMap) {
            if (activeStreams.containsKey(streamId)) {
                lockService.renewLock("camera:$cameraId", podId)
            }
        }
    }

    override suspend fun requestStream(camera: Camera, sessionId: String, session: WebSocketSession): CameraStreamResponse {
        // Check if there's already a stream for this camera in this pod
        val existingStreamId = cameraStreamMap[camera.id]

        if (existingStreamId != null) {
            val stream = activeStreams[existingStreamId]

            if (stream != null) {
                // Add the session to the existing stream
                stream.addSession(sessionId, session)

                // Add the stream to the session's set of streams
                sessionStreams.computeIfAbsent(sessionId) { mutableSetOf() }.add(existingStreamId)

                logger.info("Added session $sessionId to existing stream $existingStreamId for camera ${camera.id}")

                return CameraStreamResponse(
                    cameraId = camera.id,
                    streamId = existingStreamId,
                    status = StreamStatus.SUCCESS
                )
            }
        }

        // Check if another pod has a lock on this camera
        val cameraLockKey = "camera:${camera.id}"
        if (lockService.isLocked(cameraLockKey) && !lockService.isLockedByOwner(cameraLockKey, podId)) {
            logger.info("Camera ${camera.id} is locked by another pod, waiting for stream to be available")

            // Another pod is handling this camera, wait for a bit to see if it becomes available
            // In a real implementation, this would use a more sophisticated approach like a shared cache
            // to discover the stream from the other pod

            return CameraStreamResponse(
                cameraId = camera.id,
                status = StreamStatus.ERROR,
                message = "Camera is being handled by another server, please try again later"
            )
        }

        // No existing stream, create a new one
        return createNewStream(camera, sessionId, session)
    }

    private suspend fun createNewStream(camera: Camera, sessionId: String, session: WebSocketSession): CameraStreamResponse {
        try {
            // Try to acquire a lock for this camera
            val cameraLockKey = "camera:${camera.id}"
            val lockAcquired = lockService.tryAcquireLock(cameraLockKey, podId, 120) // 2 minute lock

            if (!lockAcquired) {
                logger.warn("Failed to acquire lock for camera ${camera.id}")
                return CameraStreamResponse(
                    cameraId = camera.id,
                    status = StreamStatus.ERROR,
                    message = "Failed to acquire lock for camera"
                )
            }

            logger.info("Acquired lock for camera ${camera.id}")

            // Generate a unique stream ID
            val streamId = UUID.randomUUID().toString()

            // Create a new stream
            val stream = CameraStream(streamId, camera)

            // Add the session to the stream
            stream.addSession(sessionId, session)

            // Add the stream to the active streams map
            activeStreams[streamId] = stream

            // Map the camera ID to the stream ID
            cameraStreamMap[camera.id] = streamId

            // Add the stream to the session's set of streams
            sessionStreams.computeIfAbsent(sessionId) { mutableSetOf() }.add(streamId)

            // Start the GStreamer pipeline in a coroutine
            serviceScope.launch {
                try {
                    startGStreamerPipeline(camera, streamId)
                } catch (e: Exception) {
                    logger.error("Error starting GStreamer pipeline for camera ${camera.id}", e)
                    // Release the lock if we failed to start the pipeline
                    lockService.releaseLock(cameraLockKey, podId)
                    // Clean up the stream
                    cleanupStream(streamId)
                }
            }

            logger.info("Created new stream $streamId for camera ${camera.id}")

            return CameraStreamResponse(
                cameraId = camera.id,
                streamId = streamId,
                status = StreamStatus.CONNECTING
            )
        } catch (e: Exception) {
            logger.error("Error creating stream for camera ${camera.id}", e)

            // Release the lock if we acquired it
            lockService.releaseLock("camera:${camera.id}", podId)

            return CameraStreamResponse(
                cameraId = camera.id,
                status = StreamStatus.ERROR,
                message = "Failed to create stream: ${e.message}"
            )
        }
    }

    private suspend fun startGStreamerPipeline(camera: Camera, streamId: String) {
        logger.info("Starting GStreamer pipeline for camera ${camera.id} with encoding ${camera.encoding}")

        val stream = activeStreams[streamId] ?: run {
            logger.error("Stream $streamId not found, cannot start GStreamer pipeline")
            return
        }

        // Create the appropriate GStreamer pipeline command based on camera encoding
        val pipelineCommand = when (camera.encoding) {
            VideoEncoding.RTSP_H264 -> {
                // For RTSP H264 sources
                listOf(
                    "gst-launch-1.0",
                    "rtspsrc",
                    "location=${camera.url}",
                    "latency=0",
                    "!",
                    "rtph264depay",
                    "!",
                    "h264parse",
                    "!",
                    "rtph264pay",
                    "!",
                    "udpsink",
                    "host=127.0.0.1",
                    "port=5000"
                )
            }
            VideoEncoding.RTSP_H265 -> {
                // For RTSP H265 sources (transcoding to H264)
                listOf(
                    "gst-launch-1.0",
                    "rtspsrc",
                    "location=${camera.url}",
                    "latency=0",
                    "!",
                    "rtph265depay",
                    "!",
                    "h265parse",
                    "!",
                    "h264enc",
                    "!",
                    "rtph264pay",
                    "!",
                    "udpsink",
                    "host=127.0.0.1",
                    "port=5000"
                )
            }
            VideoEncoding.MPEG4 -> {
                // For MPEG4 file sources
                listOf(
                    "gst-launch-1.0",
                    "filesrc",
                    "location=${camera.url}",
                    "!",
                    "qtdemux",
                    "!",
                    "h264parse",
                    "!",
                    "rtph264pay",
                    "!",
                    "udpsink",
                    "host=127.0.0.1",
                    "port=5000"
                )
            }
        }

        try {
            // Create a process builder for the GStreamer command
            val processBuilder = ProcessBuilder(pipelineCommand)

            // Redirect error stream to output stream
            processBuilder.redirectErrorStream(true)

            // Create a log file for the GStreamer output
            val logFile = File("gstreamer-$streamId.log")
            processBuilder.redirectOutput(ProcessBuilder.Redirect.to(logFile))

            // Start the GStreamer process
            val process = processBuilder.start()

            // Store the process in the stream object
            stream.gstreamerProcess = process

            logger.info("GStreamer pipeline started for camera ${camera.id} with PID: ${process.pid()}")
        } catch (e: Exception) {
            logger.error("Failed to start GStreamer pipeline for camera ${camera.id}", e)
            throw e
        }
    }

    override suspend fun disconnectSession(streamId: String, sessionId: String): Boolean {
        val stream = activeStreams[streamId] ?: return false

        // Remove the session from the stream
        val removed = stream.removeSession(sessionId)

        if (removed) {
            // Remove the stream from the session's set of streams
            sessionStreams[sessionId]?.remove(streamId)

            // If the stream has no more active connections, clean it up
            if (!stream.hasActiveConnections()) {
                cleanupStream(streamId)
            }

            logger.info("Disconnected session $sessionId from stream $streamId")
        }

        return removed
    }

    override suspend fun disconnectAllSessions(sessionId: String) {
        // Get all streams for this session
        val streams = sessionStreams[sessionId]?.toSet() ?: emptySet()

        // Disconnect from each stream
        for (streamId in streams) {
            disconnectSession(streamId, sessionId)
        }

        // Remove the session from the map
        sessionStreams.remove(sessionId)

        logger.info("Disconnected all streams for session $sessionId")
    }

    private suspend fun stopGStreamerPipeline(streamId: String) {
        val stream = activeStreams[streamId] ?: run {
            logger.warn("Stream $streamId not found, cannot stop GStreamer pipeline")
            return
        }

        val process = stream.gstreamerProcess
        if (process != null) {
            try {
                logger.info("Stopping GStreamer pipeline for stream $streamId")

                // Check if the process is still alive
                if (process.isAlive) {
                    // Try to terminate gracefully first
                    process.destroy()

                    // Wait a bit for graceful termination
                    val terminated = process.waitFor(3, java.util.concurrent.TimeUnit.SECONDS)

                    // If not terminated, force kill
                    if (!terminated) {
                        logger.warn("GStreamer process did not terminate gracefully, forcing termination")
                        process.destroyForcibly()
                    }
                }

                // Clear the process reference
                stream.gstreamerProcess = null

                logger.info("GStreamer pipeline stopped for stream $streamId")
            } catch (e: Exception) {
                logger.error("Error stopping GStreamer pipeline for stream $streamId", e)
            }
        } else {
            logger.info("No GStreamer process found for stream $streamId")
        }
    }

    private suspend fun cleanupStream(streamId: String) {
        val stream = activeStreams[streamId] ?: return
        val cameraId = stream.camera.id

        // Stop the GStreamer pipeline
        stopGStreamerPipeline(streamId)

        // Remove the stream from the active streams map
        activeStreams.remove(streamId)

        // Remove the camera-to-stream mapping
        cameraStreamMap.entries.removeIf { it.value == streamId }

        // Release the lock for this camera
        val cameraLockKey = "camera:$cameraId"
        val lockReleased = lockService.releaseLock(cameraLockKey, podId)

        if (lockReleased) {
            logger.info("Released lock for camera $cameraId")
        } else {
            logger.warn("Failed to release lock for camera $cameraId - it may be held by another pod or already released")
        }

        logger.info("Cleaned up stream $streamId for camera $cameraId")
    }

    override fun getStream(streamId: String): CameraStream? {
        return activeStreams[streamId]
    }

    override fun getAllStreams(): Map<String, CameraStream> {
        return activeStreams.toMap()
    }
}
