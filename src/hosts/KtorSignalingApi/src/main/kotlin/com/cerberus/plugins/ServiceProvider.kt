package com.cerberus.plugins

import com.cerberus.services.CameraStreamService
import com.cerberus.services.SignalingService
import com.cerberus.services.SignalingServiceImpl
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

/**
 * Simple service provider that uses Koin for dependency injection
 * 
 * Note: This is mainly kept for backward compatibility.
 * New code should use Koin directly for dependency injection.
 */
object ServiceProvider : KoinComponent {
    // Get SignalingService from Koin
    val signalingService: SignalingService by inject()
}