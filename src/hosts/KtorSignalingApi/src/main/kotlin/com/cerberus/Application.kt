package com.cerberus

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.websocket.*
import java.time.Duration
import com.cerberus.plugins.configureRouting
import com.cerberus.plugins.configureKoin

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    // Configure Koin for dependency injection
    configureKoin()

    // Configure WebSockets with default settings
    // In Ktor 3.1.2, WebSockets configuration might be different
    install(WebSockets) {
        // Default settings are fine for now
    }

    // Configure routing
    configureRouting()
}
