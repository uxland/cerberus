import {spawn} from "child_process";
import CameraStreamBase from "./camera-stream-base.js";


const startGstProcess = (cameraId, streamingUrl, port) => {
	const gstProcess = spawn('gst-launch-1.0', [
		'rtspsrc', `location=${streamingUrl}`, 'protocols=tcp', 'latency=100', '!',
		'rtph265depay', '!', 'h265parse', '!', 'avdec_h265', '!',
		'x264enc', 'tune=zerolatency', 'key-int-max=30', '!',
		'rtph264pay', 'pt=101', 'ssrc=1234567', 'mtu=1200', '!',
		'udpsink', 'host=127.0.0.1', `port=${port}`
	]);

	gstProcess.stderr.on('data', data => console.error(`GStreamer ${cameraId} stderr: ${data}`));
	gstProcess.stdout.on('data', data => console.log(`GStreamer ${cameraId} stdout: ${data}`));
	gstProcess.on('close', code => console.log(`GStreamer ${cameraId} exited with code ${code}`));
	return gstProcess;
}



export default class CameraStream extends CameraStreamBase {
	/*constructor({router, cameraId, streamingUrl}) {
		super({router, cameraId, streamingUrl, gstProcessLauncher: startGstProcess});
	}*/
	getStartPipelineArgs(streamingUrl) {
		return [
			'rtspsrc', `location=${streamingUrl}`, 'protocols=tcp', 'latency=100', '!',
			'rtph265depay', '!', 'h265parse', '!', 'avdec_h265', '!',
		]
	}
}