package com.cerberus.models

import kotlinx.serialization.Serializable

/**
 * Enum representing the supported video encodings
 */
enum class VideoEncoding {
    RTSP_H264,
    RTSP_H265,
    MPEG4
}

/**
 * Data class representing a camera
 *
 * @property id Unique identifier for the camera
 * @property name Human-readable name for the camera
 * @property url URL to connect to the camera (RTSP or file path)
 * @property encoding Video encoding used by the camera
 * @property username Optional username for authentication
 * @property password Optional password for authentication
 */
@Serializable
data class Camera(
    val id: String,
    val name: String,
    val url: String,
    val encoding: VideoEncoding,
    val username: String? = null,
    val password: String? = null
)

/**
 * Data class representing a camera stream request from a client
 *
 * @property cameraId ID of the camera to stream
 * @property sessionId Unique identifier for the client session
 */
@Serializable
data class CameraStreamRequest(
    val cameraId: String,
    val sessionId: String
)

/**
 * Data class representing a camera stream response to a client
 *
 * @property cameraId ID of the camera being streamed
 * @property streamId Unique identifier for the stream
 * @property status Status of the stream request
 * @property message Optional message (e.g., error details)
 */
@Serializable
data class CameraStreamResponse(
    val cameraId: String,
    val streamId: String? = null,
    val status: StreamStatus,
    val message: String? = null
)

/**
 * Enum representing the status of a stream request
 */
@Serializable
enum class StreamStatus {
    SUCCESS,
    CONNECTING,
    ERROR
}