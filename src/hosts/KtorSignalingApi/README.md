# KtorSignalingApi

A WebRTC signaling server built with Ktor and Kotlin.

## Features

- WebSocket support for real-time communication
- Koin for dependency injection
- Kotlinx Serialization for JSON processing
- Containerized with Docker

## Project Structure

```
KtorSignalingApi/
├── .devcontainer/
│   ├── Dockerfile
│   ├── devcontainer.json
│   └── README.md
├── src/
│   ├── main/
│   │   ├── kotlin/
│   │   │   └── com/
│   │   │       └── cerberus/
│   │   │           ├── plugins/
│   │   │           │   ├── Koin.kt
│   │   │           │   ├── Routing.kt
│   │   │           │   └── Serialization.kt
│   │   │           ├── services/
│   │   │           │   ├── CameraStreamService.kt
│   │   │           │   ├── DistributedLockService.kt
│   │   │           │   └── SignalingService.kt
│   │   │           ├── models/
│   │   │           │   ├── Camera.kt
│   │   │           │   └── Stream.kt
│   │   │           └── Application.kt
│   │   └── resources/
│   │       └── logback.xml
│   └── test/
│       └── kotlin/
│           └── com/
│               └── cerberus/
│                   └── WebSocketIntegrationTest.kt
├── .gitignore
├── build.gradle.kts
├── Dockerfile
├── README.md
└── settings.gradle.kts
```

## Getting Started

### Prerequisites

- JDK 23
- Gradle 8.0 or higher

### Development Environment

This project includes a development container configuration with GStreamer dependencies for video streaming functionality:

- **Dev Container**: A VS Code dev container with all necessary GStreamer libraries and development tools
- **GStreamer Components**: Includes core, base, good, bad, and ugly plugin sets, plus development headers

To use the dev container:
1. Install Docker and VS Code with the Remote - Containers extension
2. Open the project in VS Code
3. When prompted, click "Reopen in Container" or run the command from the command palette
4. See the `.devcontainer/README.md` file for more details

### Running Locally

```bash
./gradlew run
```

The server will start on http://localhost:8080

### Building a Docker Image

```bash
docker build -t ktorsignalingapi .
docker run -p 8080:8080 ktorsignalingapi
```

## WebSocket API

Connect to the WebSocket endpoint at `/signaling` to exchange WebRTC signaling messages.

Example:
```javascript
const socket = new WebSocket('ws://localhost:8080/signaling');
socket.onmessage = (event) => {
  console.log('Received:', event.data);
};
socket.send(JSON.stringify({ type: 'offer', sdp: '...' }));
```

## Testing

The project includes integration tests to verify the WebSocket functionality. The tests are located in the `src/test/kotlin/com/cerberus` directory.

### Running Tests

To run the tests, use the following command:

```bash
./gradlew test
```

### WebSocket Integration Test

The `WebSocketIntegrationTest` class contains tests that verify:

1. **Basic WebSocket Connection**: Tests that a client can connect to the WebSocket endpoint, send a message, and receive a response.
2. **Multiple Messages**: Tests that a client can send multiple messages and receive the correct responses for each.
3. **Connection and Disconnection**: Tests that a client can connect and disconnect without errors.

These tests ensure that the WebSocket server is functioning correctly and can handle client connections and messages as expected.

## License

This project is part of the Cerberus platform.
