/**
 * integrating mediasoup server with a node.js application
 */

/* Please follow mediasoup installation requirements */
/* https://mediasoup.org/documentation/v3/mediasoup/installation/ */
import express from 'express'
const app = express()

import http from 'http'
import path from 'path'
const __dirname = path.resolve()

import { Server } from 'socket.io'
import mediasoup from 'mediasoup'
import cors from 'cors';
import CameraStream from "./camera-stream.js";
import {StreamingClient} from "./streaming-client.js";
import DualCameraStream from "./dual-camera-stream.js";

const activeCameras = {};
const killProcesses = () => {
	Object.keys(activeCameras).forEach(async(cameraId) => {
		const camera = activeCameras[cameraId];
		await camera.stop();
	});
}

const getCameraById = async(cameraId) => {
	if (activeCameras[cameraId]) {
		return activeCameras[cameraId];
	} else {
		const cameraStream = new DualCameraStream({router, cameraId, streamingUrl: 'rtsp://test:Test2025@80.37.229.214:39887/Streaming/Channels/102?transportmode=unicast'}        );
		await cameraStream.start();
		activeCameras[cameraId] = cameraStream;
		return cameraStream;
		//throw new Error(`Camera id ${cameraId} not found`);
	}
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Stopping GStreamer...');
  killProcesses();
  worker.close();
  process.exit();
});



app.use(cors({ origin: ["https://cerberus-react-ui:5173", "https://localhost:8080", "https://cerberus-react-ui", "https://cerberus-ui:5173", "https://ui.glaux-serverus.eu"], credentials: true }));
app.use(express.json());
app.get('/', (req, res) => {
	res.send('Hello from mediasoup app!')
})

app.get('/kill-ffmpeg', (req, res) => {
	try{
		/*ffmpegProcess.stdin.setEncoding('utf8');
		ffmpegProcess.stdin.write('q');*/
		setTimeout(() =>{
			killProcesses()
			process.exit();
		}, 5000)
		res.send('FFMpeg killed')	
	}catch (e) {
		ffmpegProcess.kill('SIGTERM');
		res.send('FFMpeg killed after error')
	}
	
})

app.use('/sfu', express.static(path.join(__dirname, 'public')))

app.put('/api/streams/:cameraId/start', async (req, res) => {
	const { cameraId } = req.params;
	console.log(`Request Starting camera ${cameraId}`);
	const { rtspUrl, encoding } = req.body;
	if (!cameraId || !rtspUrl || !encoding) {
		return res.status(400).json({ error: 'Missing required parameters' });
	}
	if(!activeCameras[cameraId]){
		const cameraStream = new DualCameraStream({router, cameraId, streamingUrl: rtspUrl});
		await cameraStream.start();
		activeCameras[cameraId] = cameraStream;
		console.log(`Stream for camera ${cameraId} started`);
	}
	res.send("Camera started");
});

app.put('/api/streams/:cameraId/stop', async (req, res) => {
	const { cameraId } = req.params;
	const camera = activeCameras[cameraId];
	await camera?.stop();
	delete activeCameras[cameraId];
	res.send('Camera stopped');
});

// SSL cert for HTTPS access
/*const options = {
	key: fs.readFileSync('/certs/ssl/key.pem', 'utf-8'),
	cert: fs.readFileSync('/certs/ssl/cert.pem', 'utf-8')
}*/

//const httpsServer = https.createServer(options, app)
const httpsServer = http.createServer(app);
const PORT = Number.parseInt(process.env.PORT || "3000");
httpsServer.listen(PORT, () => {
	console.log('listening on port: ' + PORT)
})

const io = new Server(httpsServer, {cors: {
		//origin: "https://cerberus-react-ui:5173",  // ✅ Fixed CORS issue
		origin: ["https://cerberus-react-ui:5173", "https://localhost:8080", "https://cerberus-react-ui", "https://cerberus-ui:5173", "https://ui.glaux-serverus.eu"],
		methods: ["GET", "POST"],
		credentials: true,
	},
	transports: ["websocket", "polling"], // ✅ Ensure WebSocket transport is enabled
});

// socket.io namespace (could represent a room?)
const peers = io.of('/media-soup')

/**
 * Worker
 * |-> Router(s)
 *     |-> Producer Transport(s)
 *         |-> Producer
 *     |-> Consumer Transport(s)
 *         |-> Consumer
 **/
let worker
let router
let producer
let consumer

const mediaCodecs = [
	{
		kind: 'audio',
		mimeType: 'audio/opus',
		clockRate: 48000,
		channels: 2,
	},
	{
		kind: 'video',
		mimeType: 'video/H264',
		preferredPayloadType: 96, // For GStreamer recording
		clockRate: 90000,
		parameters: {
			'packetization-mode': 1,
			'profile-level-id': '42e01f',
			'x-google-start-bitrate': 1000
		}
	},
	{
		kind: 'video',
		mimeType: 'video/H264',
		preferredPayloadType: 97, // For WebRTC
		clockRate: 90000,
		parameters: {
			'packetization-mode': 0,
			'profile-level-id': '42e01f',
			'x-google-start-bitrate': 1000
		}
	}
];

const createWorker = async () => {
	worker = await mediasoup.createWorker({
		rtcMinPort: 20000,
		rtcMaxPort: 20020,
	})
	console.log(`worker pid ${worker.pid}`)

	worker.on('died', error => {
		// This implies something serious happened, so kill the application
		console.error('mediasoup worker has died')
		setTimeout(() => process.exit(1), 2000) // exit in 2 seconds
	})


	return worker
}
(async () => {

	// We create a Worker as soon as our application starts
	worker = await createWorker();
	router = await worker.createRouter({ mediaCodecs, })


	peers.on('connection', async socket => {
		const client = new StreamingClient({socket, streamFactory:getCameraById, router});
		client.start();
		socket.on('disconnect', async () => {
			await client.stop();
		})
		return Promise.resolve();

	})
})();

