import {spawn} from "child_process";
import getPort, {portNumbers} from "get-port";
import {createProducer, createTransport} from "./router-utilities.js";

export default class CameraStreamBase{
	cameraId;
	router;
	streamingUrl;

	gstProcess;
	transport;
	producer;
	gstProcessLauncher;

	constructor({router, cameraId, streamingUrl,gstProcessLauncher}) {
		this.router = router;
		this.cameraId = cameraId;
		this.streamingUrl = streamingUrl;
		this.gstProcessLauncher = gstProcessLauncher;
	}
	async start(){
		const port =  await getPort({port: portNumbers(5000, 6000)})
		this.gstProcessLauncher = this.gstProcessLauncher(this.cameraId, this.streamingUrl, port);
		this.transport = await createTransport(this.router, port);
		this.producer = await createProducer(this.transport, this.router);
	}
	async stop(){
		this.stopGst();
		await this.stopProducer();
		await this.stopTransport();
		console.log(`CameraStream ${this.cameraId} stopped.`);
	}

	stopGst(){
		try {
			if (this.gstProcess) {
				this.gstProcess.kill("SIGTERM");
				this.gstProcess = null;
			}
			console.log(`GStreamer ${this.cameraId} stopped.`);
		}
		catch (e){
			console.error(`Error stopping GStreamer ${this.cameraId}:`, e);
		}

	}
	stopTransport(){
		try {
			if (this.transport) {
				this.transport.close();
				this.transport = null;
			}
			console.log(`Transport ${this.cameraId} stopped.`);
		}
		catch (e){
			console.error(`Error stopping Transport ${this.cameraId}:`, e);
		}

	}
	stopProducer(){
		try {
			if (this.producer) {
				this.producer.close();
				this.producer = null;
			}
			console.log(`Producer ${this.cameraId} stopped.`);
		}
		catch (e){
			console.error(`Error stopping Producer ${this.cameraId}:`, e);
		}
	}
}