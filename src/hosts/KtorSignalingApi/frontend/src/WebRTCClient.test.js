import React from 'react';
import { render, screen } from '@testing-library/react';
import WebRTCClient from './WebRTCClient';

// Mock WebSocket
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = WebSocket.OPEN;

    // Call onopen asynchronously to simulate connection establishment
    setTimeout(() => {
      if (this.onopen) this.onopen();
    }, 0);
  }

  send(data) {
    // Parse the message and simulate appropriate responses
    const message = JSON.parse(data);

    if (message.type === 'register') {
      // Simulate register_response
      setTimeout(() => {
        if (this.onmessage) {
          this.onmessage({
            data: JSON.stringify({
              type: 'register_response',
              session_id: 'test-session-id',
              status: 'success'
            })
          });
        }
      }, 10);
    } else if (message.type === 'request_stream') {
      // Simulate stream_response
      setTimeout(() => {
        if (this.onmessage) {
          this.onmessage({
            data: JSON.stringify({
              type: 'stream_response',
              camera_id: message.camera_id,
              stream_id: 'test-stream-id',
              status: 'READY'
            })
          });
        }
      }, 10);
    }
  }

  close() {
    if (this.onclose) this.onclose();
  }
}

// Add WebSocket to global
global.WebSocket = MockWebSocket;
global.WebSocket.OPEN = 1;

// Mock RTCPeerConnection
global.RTCPeerConnection = class {
  constructor() {
    this.onicecandidate = null;
    this.ontrack = null;
    this.oniceconnectionstatechange = null;
    this.iceConnectionState = 'new';
    this.localDescription = { type: 'offer', sdp: 'dummy-sdp' };
  }

  createOffer() {
    return Promise.resolve({ type: 'offer', sdp: 'dummy-sdp' });
  }

  setLocalDescription() {
    return Promise.resolve();
  }

  setRemoteDescription() {
    return Promise.resolve();
  }

  close() {}
};

test('renders WebRTCClient component', () => {
  const cameraSettings = {
    rtspUrl: 'rtsp://test:Test2025@80.37.229.214:39887/Streaming/Channels/102?transportmode=unicast',
    cameraId: '102',
    encoding: 'H265'
  };

  render(
    <WebRTCClient 
      rtspUrl={cameraSettings.rtspUrl}
      cameraId={cameraSettings.cameraId}
      encoding={cameraSettings.encoding}
    />
  );

  // Check if the component renders with the correct camera ID
  expect(screen.getByText(/Camera Stream \(ID: 102\)/i)).toBeInTheDocument();

  // Check if the RTSP URL is displayed
  expect(screen.getByText(/RTSP URL:/i)).toBeInTheDocument();
  expect(screen.getByText(/rtsp:\/\/test:Test2025@80.37.229.214:39887\/Streaming\/Channels\/102\?transportmode=unicast/i)).toBeInTheDocument();

  // Check if the encoding is displayed
  expect(screen.getByText(/Encoding:/i)).toBeInTheDocument();
  expect(screen.getByText(/H265/i)).toBeInTheDocument();

  // Check if the status is initially displayed
  expect(screen.getByText(/Status:/i)).toBeInTheDocument();

  // Initially, the status should be "Connecting to signaling server..."
  expect(screen.getByText(/Connecting to signaling server/i)).toBeInTheDocument();

  // Check if the note about limitations is displayed
  expect(screen.getByText(/This is a demonstration component/i)).toBeInTheDocument();
});
