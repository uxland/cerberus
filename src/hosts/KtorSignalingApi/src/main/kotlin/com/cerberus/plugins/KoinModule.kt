package com.cerberus.plugins

import com.cerberus.services.*
import io.ktor.server.application.*
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin

// Define the Koin module for dependency injection
val appModule = module {
    // Register DistributedLockService as a singleton
    single<DistributedLockService> { InMemoryDistributedLockService() }

    // Register CameraStreamService as a singleton with DistributedLockService dependency
    single<CameraStreamService> { CameraStreamServiceImpl(get()) }

    // Register SignalingService as a singleton with CameraStreamService dependency
    single<SignalingService> { SignalingServiceImpl(get()) }
}

// Extension function to install Koin in the Ktor application
fun Application.configureKoin() {
    install(Koin) {
        // Register the application module
        modules(appModule)
    }
}
