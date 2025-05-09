import {createProducer, createTransport} from "./router-utilities.js";
import portPool from "./port-pool.js";
import path from "path";
import fs from "fs";
import {spawn} from "child_process";
export default class CameraStreamBase {
	cameraId;
	router;
	streamingUrl;
	port;
	gstProcess;
	transport;
	producer;
	recordingBranches = {};
	controlSocketPath;

	constructor({router, cameraId, streamingUrl}) {
		this.router = router;
		this.cameraId = cameraId;
		this.streamingUrl = streamingUrl;
		this.controlSocketPath = `/tmp/${cameraId}.sock`;
		//this.gstProcessLauncher = gstProcessLauncher;
	}
	getStartPipelineArgs(streamingUrl){}

	startGst(cameraId, streamingUrl, port){
		if (fs.existsSync(this.controlSocketPath)) fs.unlinkSync(this.controlSocketPath);
		const commonArgs = [
			'tune=zerolatency', 'key-int-max=30', '!',
			'rtph264pay', 'pt=101', 'ssrc=1234567', 'mtu=1200', '!',
			'udpsink', 'host=239.1.1.1', `port=${port}`, 'auto-multicast=true'
		]
		const customArgs = this.getStartPipelineArgs(streamingUrl);
		const args = [...customArgs, ...commonArgs];
		const gstProcess = spawn('gst-launch-1.0', args);
		gstProcess.stderr.on('data', data => console.error(`GStreamer ${cameraId} stderr: ${data}`));
		gstProcess.stdout.on('data', data => console.log(`GStreamer ${cameraId} stdout: ${data}`));
		gstProcess.on('close', code => console.log(`GStreamer ${cameraId} exited with code ${code}`));
		return gstProcess;
	}

	async start() {
		this.port = portPool.allocatePort();
		console.log(`port ${this.port} for camera ${this.cameraId}`);
		this.gstProcess = this.startGst(this.cameraId, this.streamingUrl, this.port);
		this.transport = await createTransport(this.router, this.port);
		this.producer = await createProducer(this.transport, this.router);
	}

	async stop() {
		//this.stopGst();
		await this.stopProducer();
		await this.stopTransport();
		await this.stopGst();
		portPool.releasePort(this.port);
		console.log(`CameraStream ${this.cameraId} stopped.`);
	}

	async record({ peerId }) {
		if (Object.keys(this.recordingBranches).length >= 5) {
			console.warn(`⚠️ Max concurrent recordings (5) reached, denying record() for ${peerId}`);
			return;
		}

		const filename = `${this.cameraId}_${peerId}_${Date.now()}.mp4`;
		const filepath = path.join('/recordings', filename);
		fs.mkdirSync(path.dirname(filepath), { recursive: true });

		const gstProcess = spawn('gst-launch-1.0', [
			'udpsrc',
			'multicast-group=239.1.1.1',
			`port=${this.port}`,
			'auto-multicast=true',
			'caps=application/x-rtp,media=video,encoding-name=H264,payload=101', '!',
			'rtph264depay', '!', 'h264parse', '!',
			'mp4mux', '!', 'filesink', `location=${filepath}`
		]);

		gstProcess.stderr.on('data', data => console.error(`[GST] ${peerId} stderr: ${data}`));
		gstProcess.on('exit', code => {
			console.log(`🛑 Recording for peer ${peerId} exited with code ${code}`);
		});

		this.recordingBranches[peerId] = { process: gstProcess, filepath };
		console.log(`🎥 Started recording for peer ${peerId} → ${filename}`);
	}


	async stopRecording({ peerId }) {
		const branch = this.recordingBranches[peerId];
		if (!branch) return;

		try{
			branch.process.kill("SIGTERM");
		}
		catch (e) {
			console.error(e);
		}

		delete this.recordingBranches[peerId];
		console.log(`🛑 Stopped recording for peer ${peerId}`);
	}

	canConsume({rtpCapabilities}) {
		return this.router.canConsume({
			producerId: this.producer.id, rtpCapabilities
		});
	}

	async stopGst() {
		try {
			const keys = Object.keys(this.recordingBranches);
			for (const key of keys) {
				await this.stopRecording({ peerId: key });
			}
			if (this.gstProcess) {
				this.gstProcess.kill("SIGTERM");
				this.gstProcess = null;
			}
			console.log(`GStreamer ${this.cameraId} stopped.`);
		} catch (e) {
			console.error(`Error stopping GStreamer ${this.cameraId}:`, e);
		}

	}

	stopTransport() {
		try {
			if (this.transport) {
				this.transport.close();
				this.transport = null;
			}
			console.log(`Transport ${this.cameraId} stopped.`);
		} catch (e) {
			console.error(`Error stopping Transport ${this.cameraId}:`, e);
		}

	}

	stopProducer() {
		try {
			if (this.producer) {
				this.producer.close();
				this.producer = null;
			}
			console.log(`Producer ${this.cameraId} stopped.`);
		} catch (e) {
			console.error(`Error stopping Producer ${this.cameraId}:`, e);
		}
	}
}