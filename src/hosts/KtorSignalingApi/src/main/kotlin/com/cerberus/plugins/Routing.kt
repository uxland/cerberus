package com.cerberus.plugins

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import kotlinx.coroutines.channels.consumeEach
import com.cerberus.services.SignalingService
import org.koin.ktor.ext.inject

fun Application.configureRouting() {
    val signalingService: SignalingService by inject()

    routing {
        get("/") {
            call.respondText("KtorSignalingApi is running!")
        }

        get("/health") {
            call.respondText("OK")
        }

        // WebSocket endpoint for signaling
        webSocket("/signaling") {
            try {
                // Handle incoming frames
                incoming.consumeEach { frame ->
                    if (frame is Frame.Text) {
                        val text = frame.readText()
                        // Process the message using the signaling service
                        val response = signalingService.processMessage(text, this)
                        // Send response back to the client if there is one
                        if (response != null) {
                            send(Frame.Text(response))
                        }
                    }
                }
            } catch (e: Exception) {
                // Handle exceptions
                application.log.error("Error in WebSocket session", e)
                try {
                    // Send error message to client
                    send(Frame.Text("""{"type":"error","message":"Internal server error: ${e.message}"}"""))
                } catch (sendError: Exception) {
                    application.log.error("Failed to send error message", sendError)
                }
            } finally {
                // Clean up when the session is closed
                try {
                    signalingService.handleDisconnect(this)
                } catch (e: Exception) {
                    application.log.error("Error during disconnect handling", e)
                }
            }
        }
    }
}
