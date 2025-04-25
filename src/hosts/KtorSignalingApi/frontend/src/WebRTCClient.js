import React, { useEffect, useRef, useState } from 'react';
import './WebRTCClient.css';

const WebRTCClient = ({ rtspUrl, cameraId, encoding }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [streamId, setStreamId] = useState(null);
  const webSocketRef = useRef(null);
  const peerConnectionRef = useRef(null);

  useEffect(() => {
    // WebSocket connection to the signaling server
    const connectToSignalingServer = () => {
      // Determine the WebSocket URL based on the current location
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host || 'localhost:8080';
      const wsUrl = `${protocol}//${host}/signaling`;

      setStatus('Connecting to signaling server...');

      // Create WebSocket connection
      const ws = new WebSocket(wsUrl);
      webSocketRef.current = ws;

      // WebSocket event handlers
      ws.onopen = () => {
        console.log('WebSocket connection established');
        // Register with the signaling server
        sendSignalingMessage({
          type: 'register'
        });
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleSignalingMessage(message);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
          setError('Failed to parse server message: ' + err.message);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
        setStatus('Error');
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setStatus('Disconnected');

        // Attempt to reconnect after a delay
        setTimeout(() => {
          if (status !== 'Connected') {
            connectToSignalingServer();
          }
        }, 5000);
      };
    };

    // Send a message to the signaling server
    const sendSignalingMessage = (message) => {
      if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
        webSocketRef.current.send(JSON.stringify(message));
      } else {
        console.error('WebSocket not connected');
        setError('WebSocket not connected');
      }
    };

    // Handle incoming signaling messages
    const handleSignalingMessage = (message) => {
      console.log('Received signaling message:', message);

      switch (message.type) {
        case 'register_response':
          if (message.status === 'success') {
            setSessionId(message.session_id);
            console.log('Registered with session ID:', message.session_id);

            // Request the camera stream
            requestCameraStream(message.session_id);
          } else {
            setError('Registration failed: ' + (message.message || 'Unknown error'));
            setStatus('Error');
          }
          break;

        case 'stream_response':
          if (message.status === 'READY' || message.status === 'STARTING') {
            setStreamId(message.stream_id);
            setStatus('Stream ready, creating WebRTC connection...');
            createPeerConnection(message.stream_id);
          } else {
            setError('Stream request failed: ' + (message.message || 'Unknown error'));
            setStatus('Error');
          }
          break;

        case 'error':
          setError('Server error: ' + message.message);
          setStatus('Error');
          break;

        default:
          console.log('Unhandled message type:', message.type);
      }
    };

    // Request a camera stream from the server
    const requestCameraStream = (sid) => {
      setStatus('Requesting camera stream...');

      // Convert encoding to lowercase for the server
      const encodingValue = encoding.toLowerCase();

      sendSignalingMessage({
        type: 'request_stream',
        session_id: sid,
        camera_id: cameraId,
        camera_url: rtspUrl,
        encoding: encodingValue,
        // Extract username and password from RTSP URL if present
        username: rtspUrl.includes('@') ? rtspUrl.split('://')[1].split(':')[0] : undefined,
        password: rtspUrl.includes('@') ? rtspUrl.split(':')[2].split('@')[0] : undefined
      });
    };

    // Create and set up the WebRTC peer connection
    const createPeerConnection = (sid) => {
      try {
        // Create a new RTCPeerConnection
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
          ]
        });
        peerConnectionRef.current = pc;

        // Set up event handlers for the peer connection
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            console.log('ICE candidate:', event.candidate);
            // Send the ICE candidate to the signaling server
            sendSignalingMessage({
              type: 'ice_candidate',
              stream_id: sid,
              data: JSON.stringify(event.candidate)
            });
          }
        };

        pc.ontrack = (event) => {
          if (videoRef.current && event.streams && event.streams[0]) {
            videoRef.current.srcObject = event.streams[0];
            setStatus('Connected');
          }
        };

        pc.oniceconnectionstatechange = () => {
          console.log('ICE connection state:', pc.iceConnectionState);
          if (pc.iceConnectionState === 'disconnected' || 
              pc.iceConnectionState === 'failed' || 
              pc.iceConnectionState === 'closed') {
            setStatus('Disconnected');
          }
        };

        // Create and send an offer
        pc.createOffer()
          .then(offer => {
            return pc.setLocalDescription(offer);
          })
          .then(() => {
            console.log('Created and set local description');
            // Send the offer to the signaling server
            sendSignalingMessage({
              type: 'offer',
              stream_id: sid,
              data: JSON.stringify(pc.localDescription)
            });
          })
          .catch(err => {
            console.error('Error creating offer:', err);
            setError('Failed to create offer: ' + err.message);
            setStatus('Error');
          });

      } catch (err) {
        console.error('Error creating peer connection:', err);
        setError('Failed to create peer connection: ' + err.message);
        setStatus('Error');
      }
    };

    // Start the connection process
    connectToSignalingServer();

    // Cleanup function
    return () => {
      // Disconnect from the stream if connected
      if (sessionId && streamId) {
        try {
          sendSignalingMessage({
            type: 'disconnect_stream',
            stream_id: streamId
          });
        } catch (err) {
          console.error('Error disconnecting from stream:', err);
        }
      }

      // Close the peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      // Close the WebSocket connection
      if (webSocketRef.current) {
        webSocketRef.current.close();
        webSocketRef.current = null;
      }

      // Stop video tracks
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [rtspUrl, cameraId, encoding, status]);

  return (
    <div className="webrtc-client">
      <h2>Camera Stream (ID: {cameraId})</h2>
      <div className="video-container">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          controls
        />
        <div className="status-overlay">
          {status !== 'Connected' && (
            <div className="status-message">
              <p>{status}</p>
              {error && <p className="error">{error}</p>}
            </div>
          )}
        </div>
      </div>
      <div className="stream-info">
        <p><strong>RTSP URL:</strong> {rtspUrl}</p>
        <p><strong>Encoding:</strong> {encoding}</p>
        <p><strong>Status:</strong> {status}</p>
      </div>
      <div className="note">
        <p><strong>Note:</strong> This is a demonstration component. In a real application, you would need a backend service to convert the RTSP stream to WebRTC.</p>
        <p>The H265 encoding requires special handling on the server side to transcode to a format compatible with browsers.</p>
      </div>
    </div>
  );
};

export default WebRTCClient;
