# WebRTC Camera Client

A simple React web application that connects to an RTSP camera stream using WebRTC and displays the video.

## Camera Settings

This application is configured to connect to a camera with the following settings:
- RTSP URL: `rtsp://test:Test2025@80.37.229.214:39887/Streaming/Channels/102?transportmode=unicast`
- Camera ID: `102`
- Encoding: `H265`

## Implementation Details

### Components

- **WebRTCClient**: The main component that handles the WebRTC connection to the camera and displays the video stream.

### Technical Approach

The application uses WebRTC to establish a connection to the camera stream through a backend signaling service. The implementation includes:

1. **WebSocket Connection**: The client establishes a WebSocket connection to the backend SignalingService.

2. **Signaling Protocol**: The client and server exchange messages following a defined protocol:
   - Client registers with the server
   - Client requests a camera stream with specific parameters
   - Client and server exchange SDP offers/answers and ICE candidates
   - Client can disconnect from the stream when done

3. **RTSP to WebRTC Conversion**: The backend service handles connecting to the RTSP stream and converting it to WebRTC.

4. **H265 Encoding Support**: The backend service transcodes the H265 stream to a format compatible with browsers.

### Implementation Details

The WebRTCClient component:

- Establishes a WebSocket connection to the SignalingService
- Registers with the server and requests a camera stream
- Creates a WebRTC peer connection when the stream is ready
- Exchanges SDP offers/answers and ICE candidates with the server
- Displays the video stream when connected
- Handles reconnection and cleanup

The application requires the backend service to be running and accessible. The backend service is responsible for:
1. Accessing the RTSP stream
2. Converting the stream to WebRTC
3. Managing the signaling process between the browser and the camera

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:
   ```
   npm install
   ```

### Running the Application

```
npm start
```

This will start the development server and open the application in your default browser.

## Future Improvements

- Enhance error handling and recovery mechanisms
- Add user interface controls for camera PTZ (Pan, Tilt, Zoom) if supported
- Implement quality selection options (resolution, bitrate)
- Add support for multiple simultaneous camera streams
- Implement advanced authentication and authorization
- Add stream recording capabilities
- Create a dashboard for monitoring stream health and statistics
