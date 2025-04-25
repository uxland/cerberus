# Development Container for Kotlin and GStreamer

This development container provides a pre-configured environment for developing Kotlin applications with GStreamer support in the Cerberus project.

## Features

- Java 23 with Gradle 8.10
- Kotlin development environment
- Ktor framework support
- GStreamer 1.0 with all major plugin sets (base, good, bad, ugly, libav)
- GStreamer development libraries and headers
- Essential build tools (build-essential, pkg-config, git, curl, wget, zip/unzip)
- IDE extensions for Kotlin and Java development (VS Code and JetBrains)

## Usage

### Prerequisites

- Docker installed on your host machine
- One of the following IDEs:
  - VS Code with the Remote - Containers extension
  - JetBrains IntelliJ IDEA or Rider with the Dev Containers plugin

### Getting Started with VS Code

1. Open this project in VS Code
2. When prompted, click "Reopen in Container" or run the "Remote-Containers: Reopen in Container" command from the command palette
3. VS Code will build the container and open the project inside it
4. All dependencies will be available for development

### Getting Started with JetBrains IDEs (IntelliJ IDEA/Rider)

1. Open this project in IntelliJ IDEA or Rider
2. Go to File > Settings > Plugins and install the "Dev Containers" plugin if not already installed
3. Go to File > New > Dev Container
4. Select the project directory and click OK
5. The IDE will build the container and reopen the project inside it

### Running the Kotlin Application

To run the Kotlin application inside the container:

```bash
./gradlew run
```

### Running Tests

To run tests inside the container:

```bash
./gradlew test
```

### Verifying GStreamer Installation

To verify that GStreamer is correctly installed in the container, you can run:

```bash
gst-inspect-1.0 --version
```

To list all available GStreamer plugins:

```bash
gst-inspect-1.0
```

## GStreamer Components Included

- **gstreamer1.0-tools**: Core GStreamer utilities
- **gstreamer1.0-plugins-base**: Essential GStreamer plugins
- **gstreamer1.0-plugins-good**: High-quality GStreamer plugins
- **gstreamer1.0-plugins-bad**: Less-tested GStreamer plugins
- **gstreamer1.0-plugins-ugly**: Plugins with potential licensing issues
- **gstreamer1.0-libav**: Libav-based plugins for additional format support
- **Development headers** for all components

## Kotlin Development Components

- **JDK 23**: Latest Java Development Kit
- **Gradle 8.10**: Build automation tool configured for Kotlin projects
- **Kotlin JVM**: Kotlin compiler and runtime for JVM
- **Ktor Framework**: Lightweight framework for building asynchronous servers and clients
- **Koin**: Pragmatic lightweight dependency injection framework
- **kotlinx.serialization**: Kotlin serialization library
- **JUnit 5 & Kotest**: Testing frameworks for Kotlin

## Customization

If you need additional dependencies or configurations, you can modify the Dockerfile in the .devcontainer directory or the devcontainer.json file.
