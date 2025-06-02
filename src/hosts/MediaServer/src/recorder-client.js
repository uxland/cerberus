// recorder-client.js
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import portPool from "./port-pool.js";

const recordingDir = process.env.RECORDER_DIR || '/usr/media';

export default class RecorderClient {
    router = null;
    streamFactory = null;
    transport = null;
    consumer = null;
    gst = null;
    port = null;
    rtcpPort = null;
    filename = null;

    constructor(streamFactory, router) {
        this.router = router;
        this.streamFactory = streamFactory;
    }

    async startRecording(cameraId, filename) {
        this.filename = path.join(recordingDir, filename);
        fs.mkdirSync(path.dirname(this.filename), { recursive: true });
        const camera = await this.streamFactory(cameraId);

        this.port = portPool.allocatePort();
        this.rtcpPort = portPool.allocatePort();

        this.transport = await this.router.createPlainTransport({
            listenIp: '127.0.0.1',
            rtcpMux: false,
            comedia: false
        });

        await this.transport.connect({
            ip: '127.0.0.1',
            port: this.port,
            rtcpPort: this.rtcpPort
        });

        // Create consumer
        let recordRtpCapabilities = JSON.parse(JSON.stringify(this.router.rtpCapabilities));
        recordRtpCapabilities.codecs = recordRtpCapabilities.codecs.filter(c => c.mimeType === 'video/H264' && c.preferredPayloadType === 96);

        this.consumer = await this.transport.consume({
            producerId: camera.recordingProducer.id,
            rtpCapabilities: recordRtpCapabilities,
            paused: true
        });

        const encoding = this.consumer.rtpParameters.encodings[0];
        const ssrc = encoding.ssrc;
        const pt = this.consumer.rtpParameters.codecs[0].payloadType;

        const caps = `application/x-rtp, media=video, clock-rate=90000, encoding-name=H264, payload=${pt}, ssrc=(uint)${ssrc}, packetization-mode=1`;

        this.gst = spawn('gst-launch-1.0', [
            '-v', '-e',
            'rtpbin', 'name=rtpbin', 'latency=50', 'buffer-mode=0',

            'udpsrc', `port=${this.port}`, `caps=${caps}`, '!',
            'rtpbin.recv_rtp_sink_0',

            'rtpbin.', '!', 'queue', '!', 'rtph264depay', '!', 'h264parse', '!', 'mp4mux', '!', 'filesink', `location=${this.filename}`,

            'udpsrc', `port=${this.rtcpPort}`, '!', 'rtpbin.recv_rtcp_sink_0',

            'rtpbin.send_rtcp_src_0', '!', 'udpsink', 'host=127.0.0.1', `port=${this.transport.rtcpTuple.remotePort}`, 'sync=false', 'async=false'
        ]);

        this.gst.stderr.on('data', d => console.error(`[GST ERR ${this.port}]`, d.toString()));
        this.gst.stdout.on('data', d => console.log(`[GST OUT ${this.port}]`, d.toString()));
        this.gst.on('exit', code => console.log(`[GST ${this.port}] exited with code`, code));

        await new Promise(resolve => setTimeout(resolve, 250));
        await this.consumer.resume();
        console.log(`[Recorder] Started recording to ${this.filename}`);
    }

    async stopRecording() {
        await this.consumer?.close();
        await this.transport?.close();
        this.gst?.kill('SIGINT');
        console.log(`[Recorder] Stopped recording ${this.filename}`);
        if (this.port) portPool.releasePort(this.port);
        if (this.rtcpPort) portPool.releasePort(this.rtcpPort);
    }
}
