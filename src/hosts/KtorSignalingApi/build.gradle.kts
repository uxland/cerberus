plugins {
    java
    application
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.ktor)
    alias(libs.plugins.kotlin.serialization)
}

group = "com.cerberus"
version = "0.0.1"

application {
    mainClass.set("com.cerberus.ApplicationKt")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=true")
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(23))
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // Ktor core dependencies
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.netty)
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.ktor.serialization.kotlinx.json)

    // WebSockets support
    implementation(libs.ktor.server.websockets)

    // Koin for dependency injection
    implementation(libs.koin.core)
    implementation(libs.koin.ktor)
    implementation(libs.koin.logger.slf4j)

    // Logging
    implementation(libs.logback.classic)

    // Testing
    testImplementation(libs.ktor.server.tests)
    testImplementation(libs.kotlin.test.junit5)
    testImplementation(libs.junit.jupiter.api)
    testImplementation(libs.junit.jupiter.params)
    testRuntimeOnly(libs.junit.jupiter.engine)
    testImplementation(libs.ktor.client.websockets)
    testImplementation(libs.kotest.assertions.core)
}

// Configure Gradle Wrapper task
tasks.wrapper {
    gradleVersion = "8.10"
    distributionType = Wrapper.DistributionType.BIN
}

// Configure test task to use JUnit Jupiter
tasks.withType<Test> {
    useJUnitPlatform()
}
