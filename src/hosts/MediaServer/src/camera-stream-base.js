import {createProducer, createTransport} from "./router-utilities.js";
import portPool from "./port-pool.js";
import {spawn} from "child_process";
export default class CameraStreamBase {
	cameraId;
	router;
	streamingUrl;
	port;
	gstProcess;
	transport;
	producer;

	constructor({router, cameraId, streamingUrl}) {
		this.router = router;
		this.cameraId = cameraId;
		this.streamingUrl = streamingUrl;
	}
	getStartPipelineArgs(streamingUrl){}

	startGst(cameraId, streamingUrl, port){
		const commonArgs = [
			'x264enc', 'tune=zerolatency', 'key-int-max=30', 'byte-stream=true', '!',
			'rtph264pay', 'pt=101', 'config-interval=1', 'ssrc=1234567', 'mtu=1200', '!',
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


	canConsume({rtpCapabilities}) {
		return this.router.canConsume({
			producerId: this.producer.id, rtpCapabilities
		});
	}

	async stopGst() {
		try {
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