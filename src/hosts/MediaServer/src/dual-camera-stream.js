// dual-camera-stream.js
import { spawn } from 'child_process';
import portPool from "./port-pool.js";

export default class DualCameraStream {
    constructor({ router, cameraId, streamingUrl, codec }) {
        this.router = router;
        this.cameraId = cameraId;
        this.streamingUrl = streamingUrl;
        this.codec = codec;
        this.gstProcess = null;
        this.webrtcTransport = null;
        this.recordingTransport = null;
        this.webrtcProducer = null;
        this.recordingProducer = null;
        this.webRTCPort = null;
        this.recordingPort = null;
        this.producer = null;
        this.clientCount = 0;
    }

    async start() {
        this.recordingPort = portPool.allocatePort();
        this.webRTCPort = portPool.allocatePort();
        this.spawnGStreamer();
        await this.setupTransports();
        await this.setupProducers();

    }

    async stop() {
        try {
            await this.webrtcProducer?.close();
            await this.recordingProducer?.close();
            await this.webrtcTransport?.close();
            await this.recordingTransport?.close();
            this.gstProcess?.kill('SIGINT');
        }catch (error) {
            console.error(`[DualCameraStream] Error during stop: ${error}`);
        }finally {
            if(this.recordingPort) portPool.releasePort(this.recordingPort);
            if(this.webRTCPort) portPool.releasePort(this.webRTCPort);
        }

    }

    async setupTransports() {
        this.webrtcTransport = await this.router.createPlainTransport({ listenIp: '0.0.0.0', rtcpMux: true, comedia: true, port: this.webRTCPort });
        this.recordingTransport = await this.router.createPlainTransport({ listenIp: '0.0.0.0', rtcpMux: true, comedia: true, port: this.recordingPort });
        await this.webrtcTransport.connect({ ip: "127.0.0.1", port: this.webRTCPort });
        await this.recordingTransport.connect({ ip: "127.0.0.1", port: this.recordingPort });
    }

    async setupProducers() {
        const videoCodec = this.router.rtpCapabilities.codecs.find(c => c.mimeType.toLowerCase() === "video/h264");
        this.webrtcProducer = await this.webrtcTransport.produce({
            kind: 'video',
            rtpParameters: {
                codecs: [{
                    mimeType: "video/H264",
                    clockRate: 90000,
                    payloadType: 101,  // ✅ Match FFmpeg
                    rtcpFeedback: videoCodec.rtcpFeedback,
                    parameters: {
                        "packetization-mode": 0,
                    }
                }],
                encodings: [{ ssrc: 1111111 }]
            }
        });

        this.recordingProducer = await this.recordingTransport.produce({
            kind: 'video',
            rtpParameters: {
                codecs: [{
                    mimeType: 'video/H264',
                    clockRate: 90000,
                    payloadType: 96,
                    parameters: { 'packetization-mode': 1, 'profile-level-id': '42e01f' },
                    rtcpFeedback: []
                }],
                encodings: [{ ssrc: 2222222 }]
            }
        });
        this.producer = this.webrtcProducer;
    }

    spawnGStreamer() {

        const args = [
            'rtspsrc', `location=${this.streamingUrl}`, 'protocols=tcp', 'latency=100', '!',
            ...this.getGstpCameraConnectionArgs(),
            'x264enc', 'tune=zerolatency', 'key-int-max=30', 'byte-stream=true', '!',
            'tee', 'name=t',

            // WebRTC branch
            't.', '!', 'queue', '!',
            'rtph264pay', 'pt=101', 'config-interval=1', 'ssrc=1111111', 'mtu=1200', '!',
            'udpsink', 'host=127.0.0.1', `port=${this.webRTCPort}`,

            // Recording branch
           't.', '!', 'queue', '!',
            'rtph264pay', 'pt=96', 'config-interval=1', 'ssrc=2222222', 'mtu=1200', '!',
            'udpsink', 'host=127.0.0.1', `port=${this.recordingPort}`
        ];
        this.gstProcess = spawn('gst-launch-1.0', args);
        this.gstProcess.stderr.on('data', d => console.error(`[Gst Camera ${this.cameraId} ERROR]`, d.toString()));
      //  this.gstProcess.stdout.on('data', d => console.log(`[Gst Camera ${this.cameraId}]`, d.toString()));
        this.gstProcess.on('exit', code => console.log(`[Gst Camera ${this.cameraId}] exited with code ${code}`));
    }
    canConsume({ rtpCapabilities }) {
        return this.router.canConsume({
            producerId: this.webrtcProducer.id,
            rtpCapabilities
        });
    }
    join({ rtpCapabilities }){
        if(!this.canConsume({ rtpCapabilities })){
            return { success: false, error: "Client does not support stream" };
        }
        this.clientConnected();
        return {success: true}
    }
    getGstpCameraConnectionArgs(){
        return this.codec === 'h265' ? this.getH265PipelineArgs() : this.getH264PipelineArgs();
    }

    getH265PipelineArgs() {
        return [
            'rtph265depay', '!', 'h265parse', '!', 'avdec_h265', '!',
        ]
    }
    getH264PipelineArgs() {
        return [

        ]
    }
    clientConnected() {
        this.clientCount++;
    }
    async clientDisconnected() {
        this.clientCount--;
        if (this.clientCount <= 0) {
            await this.stop();
        }
    }
}
