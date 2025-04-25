import React from 'react';
import './App.css';
import WebRTCClient from './WebRTCClient';

function App() {
  // Camera settings from the requirements
  const cameraSettings = {
    rtspUrl: 'rtsp://test:Test2025@80.37.229.214:39887/Streaming/Channels/102?transportmode=unicast',
    cameraId: '102',
    encoding: 'H265'
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>WebRTC Camera Client</h1>
      </header>
      <main>
        <WebRTCClient 
          rtspUrl={cameraSettings.rtspUrl}
          cameraId={cameraSettings.cameraId}
          encoding={cameraSettings.encoding}
        />
      </main>
    </div>
  );
}

export default App;