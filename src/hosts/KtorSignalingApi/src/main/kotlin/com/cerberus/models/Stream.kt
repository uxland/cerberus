package com.cerberus.models

import io.ktor.websocket.*
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicInteger
import java.io.File
import java.lang.ProcessBuilder

/**
 * Class representing an active camera stream
 *
 * @property streamId Unique identifier for the stream
 * @property camera The camera being streamed
 */
class CameraStream(
    val streamId: String,
    val camera: Camera
) {
    // Track connected sessions with their session IDs
    private val connectedSessions = ConcurrentHashMap<String, WebSocketSession>()

    // Counter for active connections
    private val activeConnections = AtomicInteger(0)

    // GStreamer pipeline process
    @Volatile
    var gstreamerProcess: Process? = null

    /**
     * Add a session to this stream
     *
     * @param sessionId Unique identifier for the client session
     * @param session WebSocket session for the client
     * @return true if this is a new connection, false if the session was already connected
     */
    fun addSession(sessionId: String, session: WebSocketSession): Boolean {
        val isNewConnection = connectedSessions.putIfAbsent(sessionId, session) == null
        if (isNewConnection) {
            activeConnections.incrementAndGet()
        }
        return isNewConnection
    }

    /**
     * Remove a session from this stream
     *
     * @param sessionId Unique identifier for the client session
     * @return true if the session was removed, false if it wasn't connected
     */
    fun removeSession(sessionId: String): Boolean {
        val removed = connectedSessions.remove(sessionId) != null
        if (removed) {
            activeConnections.decrementAndGet()
        }
        return removed
    }

    /**
     * Check if a session is connected to this stream
     *
     * @param sessionId Unique identifier for the client session
     * @return true if the session is connected, false otherwise
     */
    fun hasSession(sessionId: String): Boolean {
        return connectedSessions.containsKey(sessionId)
    }

    /**
     * Get the number of active connections to this stream
     *
     * @return The number of active connections
     */
    fun getActiveConnectionCount(): Int {
        return activeConnections.get()
    }

    /**
     * Check if this stream has any active connections
     *
     * @return true if there are active connections, false otherwise
     */
    fun hasActiveConnections(): Boolean {
        return activeConnections.get() > 0
    }

    /**
     * Get all connected sessions
     *
     * @return Map of session IDs to WebSocket sessions
     */
    fun getConnectedSessions(): Map<String, WebSocketSession> {
        return connectedSessions.toMap()
    }
}

/**
 * Data class for WebRTC signaling messages
 *
 * @property type Type of signaling message (offer, answer, ice, etc.)
 * @property streamId ID of the stream this message relates to
 * @property sessionId ID of the client session
 * @property data JSON data for the signaling message
 */
@kotlinx.serialization.Serializable
data class SignalingMessage(
    val type: String,
    val streamId: String,
    val sessionId: String,
    val data: String
)
