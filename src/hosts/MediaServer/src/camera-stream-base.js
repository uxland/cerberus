import {createProducer, createTransport} from "./router-utilities.js";
import portPool from "./port-pool.js";

export default class CameraStreamBase{
	cameraId;
	router;
	streamingUrl;
	port;
	gstProcess;
	transport;
	producer;
	gstProcessLauncher;
	pipeline;

	constructor({router, cameraId, streamingUrl,gstProcessLauncher}) {
		this.router = router;
		this.cameraId = cameraId;
		this.streamingUrl = streamingUrl;
		this.gstProcessLauncher = gstProcessLauncher;
	}
	getStartPipelineScript(){

	}
	async startGst(){
		
	}
	async start(){
		this.port =  portPool.allocatePort();
		console.log(`port ${this.port} for camera ${this.cameraId}`);
		this.gstProcessLauncher = this.gstProcessLauncher(this.cameraId, this.streamingUrl, this.port);
		this.transport = await createTransport(this.router, this.port);
		this.producer = await createProducer(this.transport, this.router);
	}
	async stop(){
		this.stopGst();
		await this.stopProducer();
		await this.stopTransport();
		portPool.releasePort(this.port);
		console.log(`CameraStream ${this.cameraId} stopped.`);
	}

	canConsume({rtpCapabilities}){
		return this.router.canConsume({
			producerId: this.producer.id,
			rtpCapabilities
		});
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