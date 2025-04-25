package com.cerberus

import io.kotest.matchers.booleans.shouldBeTrue
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import io.ktor.client.plugins.websocket.*
import io.ktor.serialization.kotlinx.*
import io.ktor.server.testing.*
import io.ktor.websocket.*
import kotlinx.serialization.json.*
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.koin.core.context.GlobalContext
import org.koin.core.context.stopKoin

class WebSocketIntegrationTest {

    @BeforeEach
    fun setup() {
        // Make sure Koin is stopped before each test
        if (GlobalContext.getOrNull() != null) {
            stopKoin()
        }
    }

    @AfterEach
    fun tearDown() {
        // Make sure Koin is stopped after each test
        if (GlobalContext.getOrNull() != null) {
            stopKoin()
        }
    }

    @Test
    fun testSessionRegistration() = testApplication {
        // Configure the test application with the module
        application {
            module()
        }

        // Create a client with WebSocket support
        val client = createClient {
            install(WebSockets) {
                contentConverter = KotlinxWebsocketSerializationConverter(Json)
            }
        }

        // Connect to the WebSocket endpoint and test
        client.webSocket("/signaling") {
            // Send a registration message
            val registerMessage = buildJsonObject {
                put("type", JsonPrimitive("register"))
            }
            send(Frame.Text(registerMessage.toString()))

            // Receive the response
            val response = (incoming.receive() as Frame.Text).readText()
            val jsonResponse = Json.parseToJsonElement(response).jsonObject

            // Verify the response
            jsonResponse["type"]?.jsonPrimitive?.content shouldBe "register_response"
            jsonResponse["status"]?.jsonPrimitive?.content shouldBe "success"
            jsonResponse["session_id"]?.jsonPrimitive?.content?.isNotBlank() shouldBe true

            // Close the session
            close(CloseReason(CloseReason.Codes.NORMAL, "Test completed"))
        }
    }

    @Test
    fun testStreamRequest() = testApplication {
        application {
            module()
        }

        val client = createClient {
            install(WebSockets) {
                contentConverter = KotlinxWebsocketSerializationConverter(Json)
            }
        }

        client.webSocket("/signaling") {
            // First register to get a session ID
            val registerMessage = buildJsonObject {
                put("type", JsonPrimitive("register"))
            }
            send(Frame.Text(registerMessage.toString()))

            // Get the session ID from the response
            val registerResponse = (incoming.receive() as Frame.Text).readText()
            val jsonRegisterResponse = Json.parseToJsonElement(registerResponse).jsonObject
            val sessionId = jsonRegisterResponse["session_id"]?.jsonPrimitive?.content
                ?: throw IllegalStateException("No session ID in response")

            // Now request a stream
            val streamRequestMessage = buildJsonObject {
                put("type", JsonPrimitive("request_stream"))
                put("camera_id", JsonPrimitive("test-camera-1"))
                put("camera_name", JsonPrimitive("Test Camera 1"))
                put("camera_url", JsonPrimitive("rtsp://example.com/stream1"))
                put("encoding", JsonPrimitive("h264"))
            }
            send(Frame.Text(streamRequestMessage.toString()))

            // Get the stream response
            val streamResponse = (incoming.receive() as Frame.Text).readText()
            val jsonStreamResponse = Json.parseToJsonElement(streamResponse).jsonObject

            // Verify the response
            jsonStreamResponse["type"]?.jsonPrimitive?.content shouldBe "stream_response"
            jsonStreamResponse["camera_id"]?.jsonPrimitive?.content shouldBe "test-camera-1"
            jsonStreamResponse["status"]?.jsonPrimitive?.content shouldBe "CONNECTING"
            jsonStreamResponse["stream_id"]?.jsonPrimitive?.content?.isNotBlank() shouldBe true

            close(CloseReason(CloseReason.Codes.NORMAL, "Test completed"))
        }
    }

    @Test
    fun testErrorHandling() = testApplication {
        application {
            module()
        }

        val client = createClient {
            install(WebSockets) {
                contentConverter = KotlinxWebsocketSerializationConverter(Json)
            }
        }

        client.webSocket("/signaling") {
            // Send an invalid message
            send(Frame.Text("This is not valid JSON"))

            // Receive the error response
            val response = (incoming.receive() as Frame.Text).readText()
            val jsonResponse = Json.parseToJsonElement(response).jsonObject

            // Verify the error response
            jsonResponse["type"]?.jsonPrimitive?.content shouldBe "error"
            jsonResponse["message"]?.jsonPrimitive?.content shouldContain "Invalid message format"

            close(CloseReason(CloseReason.Codes.NORMAL, "Test completed"))
        }
    }

    @Test
    fun testConnectionAndDisconnection() = testApplication {
        application {
            module()
        }

        val client = createClient {
            install(WebSockets) {
                contentConverter = KotlinxWebsocketSerializationConverter(Json)
            }
        }

        // Test that we can connect and disconnect without errors
        client.webSocket("/signaling") {
            // Just connect and disconnect
            val closeReason = CloseReason(CloseReason.Codes.NORMAL, "Test completed")
            close(closeReason)

            // The test passes if no exception is thrown
            true shouldBe true
        }
    }
}
