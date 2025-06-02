import CameraStreamBase from "./camera-stream-base.js";
import {spawn} from "child_process";

const startGstProcess = (cameraId, streamingUrl, port) => {
	const gstProcess = spawn('gst-launch-1.0', [
		'rtspsrc', `location=${streamingUrl}`, 'protocols=tcp', 'latency=100', '!',
		'x264enc', 'tune=zerolatency', 'key-int-max=30', '!',
		'rtph264pay', 'pt=101', 'ssrc=1234567', 'mtu=1200', '!',
		'udpsink', 'host=127.0.0.1', `port=${port}`
	]);

	gstProcess.stderr.on('data', data => console.error(`GStreamer ${cameraId} stderr: ${data}`));
	gstProcess.stdout.on('data', data => console.log(`GStreamer ${cameraId} stdout: ${data}`));
	gstProcess.on('close', code => console.log(`GStreamer ${cameraId} exited with code ${code}`));
	return gstProcess;
}
export default class H264CameraStream extends CameraStreamBase {
	constructor({router, cameraId, streamingUrl}) {
		super({router, cameraId, streamingUrl, gstProcessLauncher: startGstProcess});
	}
	getStartPipelineArgs(streamingUrl) {
		return [
			'rtspsrc', `location=${streamingUrl}`, 'protocols=tcp', 'latency=100', '!',
			'x264enc',
		]
	}
	getStartPipelineScript() {
		return `rtspsrc location=${streamingUrl} protocols=tcp latency=100 ! 
  rtph264depay ! h264parse ! `
	}
}