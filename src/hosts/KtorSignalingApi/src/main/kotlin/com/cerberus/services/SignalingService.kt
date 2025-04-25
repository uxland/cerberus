package com.cerberus.services

import com.cerberus.models.*
import io.ktor.websocket.*
import kotlinx.serialization.json.*
import org.slf4j.LoggerFactory
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

/**
 * Interface for the signaling service that handles WebRTC signaling messages
 */
interface SignalingService {
    /**
     * Process an incoming signaling message
     * 
     * @param message The message to process
     * @param session The WebSocket session that sent the message
     * @return The response message to send back, or null if no response is needed
     */
    suspend fun processMessage(message: String, session: WebSocketSession): String?

    /**
     * Handle a client disconnection
     * 
     * @param session The WebSocket session that was disconnected
     */
    suspend fun handleDisconnect(session: WebSocketSession)
}

/**
 * Implementation of the SignalingService interface
 */
class SignalingServiceImpl(
    private val cameraStreamService: CameraStreamService
) : SignalingService {
    private val logger = LoggerFactory.getLogger(SignalingServiceImpl::class.java)

    // Map to store active sessions with their session IDs
    private val sessions = ConcurrentHashMap<String, WebSocketSession>()

    // Map to store session IDs by WebSocket session
    private val sessionIds = ConcurrentHashMap<WebSocketSession, String>()

    // JSON parser
    private val json = Json { ignoreUnknownKeys = true }

    override suspend fun processMessage(message: String, session: WebSocketSession): String? {
        try {
            // Parse the message as JSON
            val jsonElement = try {
                json.parseToJsonElement(message)
            } catch (e: Exception) {
                logger.error("Invalid message format: not valid JSON", e)
                return createErrorResponse("Invalid message format: not valid JSON")
            }

            if (jsonElement !is JsonObject) {
                logger.error("Invalid message format: not a JSON object")
                return createErrorResponse("Invalid message format: not a JSON object")
            }

            // Get the message type
            val type = jsonElement["type"]?.jsonPrimitive?.content
                ?: return createErrorResponse("Missing message type")

            // Process the message based on its type
            return when (type) {
                "register" -> handleRegisterMessage(jsonElement, session)
                "request_stream" -> handleStreamRequest(jsonElement, session)
                "offer" -> handleOfferMessage(jsonElement, session)
                "answer" -> handleAnswerMessage(jsonElement, session)
                "ice_candidate" -> handleIceCandidateMessage(jsonElement, session)
                "disconnect_stream" -> handleDisconnectStreamMessage(jsonElement, session)
                else -> createErrorResponse("Unknown message type: $type")
            }
        } catch (e: Exception) {
            logger.error("Error processing message", e)
            return createErrorResponse("Error processing message: ${e.message}")
        }
    }

    private suspend fun handleRegisterMessage(jsonElement: JsonObject, session: WebSocketSession): String {
        // Generate a session ID if one doesn't exist
        val sessionId = jsonElement["session_id"]?.jsonPrimitive?.content ?: UUID.randomUUID().toString()

        // Register the session
        sessions[sessionId] = session
        sessionIds[session] = sessionId

        logger.info("Registered session: $sessionId")

        // Return the session ID to the client
        return json.encodeToString(
            JsonObject.serializer(),
            buildJsonObject {
                put("type", JsonPrimitive("register_response"))
                put("session_id", JsonPrimitive(sessionId))
                put("status", JsonPrimitive("success"))
            }
        )
    }

    private suspend fun handleStreamRequest(jsonElement: JsonObject, session: WebSocketSession): String {
        // Get the session ID
        val sessionId = getSessionId(session) ?: return createErrorResponse("Session not registered")

        // Get the camera ID
        val cameraId = jsonElement["camera_id"]?.jsonPrimitive?.content
            ?: return createErrorResponse("Missing camera ID")

        // Create a camera object from the request
        // In a real implementation, this would come from a camera repository
        val camera = Camera(
            id = cameraId,
            name = jsonElement["camera_name"]?.jsonPrimitive?.content ?: "Camera $cameraId",
            url = jsonElement["camera_url"]?.jsonPrimitive?.content ?: "rtsp://example.com/stream",
            encoding = when (jsonElement["encoding"]?.jsonPrimitive?.content) {
                "h265" -> VideoEncoding.RTSP_H265
                "mpeg4" -> VideoEncoding.MPEG4
                else -> VideoEncoding.RTSP_H264
            },
            username = jsonElement["username"]?.jsonPrimitive?.content,
            password = jsonElement["password"]?.jsonPrimitive?.content
        )

        // Request the stream
        val response = cameraStreamService.requestStream(camera, sessionId, session)

        // Return the response
        return json.encodeToString(
            JsonObject.serializer(),
            buildJsonObject {
                put("type", JsonPrimitive("stream_response"))
                put("camera_id", JsonPrimitive(response.cameraId))
                put("status", JsonPrimitive(response.status.toString()))
                response.streamId?.let { put("stream_id", JsonPrimitive(it)) }
                response.message?.let { put("message", JsonPrimitive(it)) }
            }
        )
    }

    private suspend fun handleOfferMessage(jsonElement: JsonObject, session: WebSocketSession): String? {
        // Get the session ID
        val sessionId = getSessionId(session) ?: return createErrorResponse("Session not registered")

        // Get the stream ID
        val streamId = jsonElement["stream_id"]?.jsonPrimitive?.content
            ?: return createErrorResponse("Missing stream ID")

        // Get the offer data
        val offerData = jsonElement["data"]?.toString()
            ?: return createErrorResponse("Missing offer data")

        // Get the stream
        val stream = cameraStreamService.getStream(streamId)
            ?: return createErrorResponse("Stream not found")

        // Create a signaling message
        val signalingMessage = SignalingMessage(
            type = "offer",
            streamId = streamId,
            sessionId = sessionId,
            data = offerData
        )

        // In a real implementation, this would forward the offer to the WebRTC peer
        logger.info("Received offer for stream $streamId from session $sessionId")

        // No response needed for now
        return null
    }

    private suspend fun handleAnswerMessage(jsonElement: JsonObject, session: WebSocketSession): String? {
        // Get the session ID
        val sessionId = getSessionId(session) ?: return createErrorResponse("Session not registered")

        // Get the stream ID
        val streamId = jsonElement["stream_id"]?.jsonPrimitive?.content
            ?: return createErrorResponse("Missing stream ID")

        // Get the answer data
        val answerData = jsonElement["data"]?.toString()
            ?: return createErrorResponse("Missing answer data")

        // Get the stream
        val stream = cameraStreamService.getStream(streamId)
            ?: return createErrorResponse("Stream not found")

        // Create a signaling message
        val signalingMessage = SignalingMessage(
            type = "answer",
            streamId = streamId,
            sessionId = sessionId,
            data = answerData
        )

        // In a real implementation, this would forward the answer to the WebRTC peer
        logger.info("Received answer for stream $streamId from session $sessionId")

        // No response needed for now
        return null
    }

    private suspend fun handleIceCandidateMessage(jsonElement: JsonObject, session: WebSocketSession): String? {
        // Get the session ID
        val sessionId = getSessionId(session) ?: return createErrorResponse("Session not registered")

        // Get the stream ID
        val streamId = jsonElement["stream_id"]?.jsonPrimitive?.content
            ?: return createErrorResponse("Missing stream ID")

        // Get the ICE candidate data
        val candidateData = jsonElement["data"]?.toString()
            ?: return createErrorResponse("Missing ICE candidate data")

        // Get the stream
        val stream = cameraStreamService.getStream(streamId)
            ?: return createErrorResponse("Stream not found")

        // Create a signaling message
        val signalingMessage = SignalingMessage(
            type = "ice_candidate",
            streamId = streamId,
            sessionId = sessionId,
            data = candidateData
        )

        // In a real implementation, this would forward the ICE candidate to the WebRTC peer
        logger.info("Received ICE candidate for stream $streamId from session $sessionId")

        // No response needed for now
        return null
    }

    private suspend fun handleDisconnectStreamMessage(jsonElement: JsonObject, session: WebSocketSession): String {
        // Get the session ID
        val sessionId = getSessionId(session) ?: return createErrorResponse("Session not registered")

        // Get the stream ID
        val streamId = jsonElement["stream_id"]?.jsonPrimitive?.content
            ?: return createErrorResponse("Missing stream ID")

        // Disconnect the session from the stream
        val disconnected = cameraStreamService.disconnectSession(streamId, sessionId)

        // Return the response
        return json.encodeToString(
            JsonObject.serializer(),
            buildJsonObject {
                put("type", JsonPrimitive("disconnect_response"))
                put("stream_id", JsonPrimitive(streamId))
                put("status", JsonPrimitive(if (disconnected) "success" else "error"))
                if (!disconnected) {
                    put("message", JsonPrimitive("Failed to disconnect from stream"))
                }
            }
        )
    }

    private fun getSessionId(session: WebSocketSession): String? {
        return sessionIds[session]
    }

    private fun createErrorResponse(message: String): String {
        return json.encodeToString(
            JsonObject.serializer(),
            buildJsonObject {
                put("type", JsonPrimitive("error"))
                put("message", JsonPrimitive(message))
            }
        )
    }

    override suspend fun handleDisconnect(session: WebSocketSession) {
        // Get the session ID
        val sessionId = sessionIds[session]

        if (sessionId != null) {
            // Disconnect all streams for this session
            cameraStreamService.disconnectAllSessions(sessionId)

            // Remove the session from the maps
            sessions.remove(sessionId)
            sessionIds.remove(session)

            logger.info("Session disconnected: $sessionId")
        }
    }
}
