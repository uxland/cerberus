// recorder-client.js
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import portPool from "./port-pool.js";

export default class RecorderClient {
    router = null;
    produce = null;
    port = null;
    transport = null;
    consumer = null;
    gst = null;
    streamFactory = null;
    filename = null;
    constructor(streamFactory, router) {
        this.router = router;
        this.streamFactory = streamFactory;
    }

    async startRecording(cameraId, filename) {
        this.filename = filename;
        fs.mkdirSync(path.dirname(this.filename), { recursive: true });
        const camera = await this.streamFactory(cameraId);
        this.port = portPool.allocatePort();
        this.transport = await this.router.createPlainTransport({
            listenIp: '127.0.0.1',
            rtcpMux: true,
            comedia: false
        });

        await this.transport.connect({ ip: '127.0.0.1', port: this.port });

        // Launch GStreamer BEFORE creating the consumer
        const caps = 'application/x-rtp,media=video,encoding-name=H264,' +
            'payload=96,clock-rate=90000,packetization-mode=1,profile-level-id=42e01f';

        this.gst = spawn('gst-launch-1.0', [
            'udpsrc', `port=${this.port}`, `caps=${caps}`,
            '!', 'rtph264depay', '!', 'h264parse', '!', 'mp4mux', '!', 'filesink', `location=${this.filename}`
        ], { stdio: ['ignore', 'ignore', 'pipe'] });

        this.gst.stderr.on('data', d => console.error(`[GST ERR ${this.port}]`, d.toString()));
        this.gst.stdout.on('data', d => console.log(`[GST OUT ${this.port}]`, d.toString()));
        this.gst.on('exit', code => console.log(`[GST ${this.port}] exited with code`, code));

        // Slight delay to ensure GStreamer binds the port
        await new Promise(resolve => setTimeout(resolve, 250));

        let recordRtpCapabilities = JSON.parse(JSON.stringify(this.router.rtpCapabilities));
        recordRtpCapabilities.codecs = recordRtpCapabilities.codecs.filter(c => c.mimeType === 'video/H264' && c.preferredPayloadType === 96);
        // Now safely create and resume the consumer
        this.consumer = await this.transport.consume({
            producerId: camera.recordingProducer.id,
            rtpCapabilities: recordRtpCapabilities,
            paused: true
        });

        await this.consumer.resume();
        console.log(`[Recorder] Started recording to ${this.filename}`);
    }

    async stopRecording() {
        await this.consumer?.close();
        await this.transport?.close();
        this.gst?.kill('SIGINT');
        console.log(`[Recorder] Stopped recording ${this.filename}`);
        this.port && portPool.allocatePort(this.port);
    }
}
