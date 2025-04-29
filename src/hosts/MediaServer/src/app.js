/**
 * integrating mediasoup server with a node.js application
 */

/* Please follow mediasoup installation requirements */
/* https://mediasoup.org/documentation/v3/mediasoup/installation/ */
import express from 'express'
const app = express()

import https from 'httpolyglot'
import fs from 'fs'
import path from 'path'
const __dirname = path.resolve()

import { Server } from 'socket.io'
import mediasoup from 'mediasoup'
import cors from 'cors';
import CameraStream from "./camera-stream.js";
import {StreamingClient} from "./streaming-client.js";

const activeCameras = {};
const killProcesses = () => {
	Object.keys(activeCameras).forEach(async(cameraId) => {
		const camera = activeCameras[cameraId];
		await camera.stop();
	});
}

const getCameraById = async(cameraId) => {
	if (activeCameras[cameraId]) {
		return activeCameras[id];
	} else {
		const cameraStream = new CameraStream({router, cameraId, streamingUrl: 'rtsp://test:Test2025@80.37.229.214:39887/Streaming/Channels/102?transportmode=unicast'}        );
		await cameraStream.start();
		activeCameras[cameraId] = cameraStream;
		return cameraStream;
	}
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Stopping GStreamer...');
  killProcesses();
  process.exit();
});



app.use(cors({ origin: ["https://cerberus-react-ui:5173", "https://cerberus-react-ui", "https://cerberus-ui:5173"], credentials: true }));

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

// SSL cert for HTTPS access
const options = {
	key: fs.readFileSync('/certs/ssl/key.pem', 'utf-8'),
	cert: fs.readFileSync('/certs/ssl/cert.pem', 'utf-8')
}

const httpsServer = https.createServer(options, app)
httpsServer.listen(3000, () => {
	console.log('listening on port: ' + 3000)
})

const io = new Server(httpsServer, {cors: {
		origin: "https://cerberus-react-ui:5173",  // ✅ Fixed CORS issue
		methods: ["GET", "POST"],
		credentials: true,
	},
	transports: ["websocket", "polling"], // ✅ Ensure WebSocket transport is enabled
});

// socket.io namespace (could represent a room?)
const peers = io.of('/mediasoup')

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
		mimeType: 'video/h264',
		clockRate: 90000,
		parameters: {
			'x-google-start-bitrate': 1000,
		},
	},
]

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
	// This is an Array of RtpCapabilities
	// https://mediasoup.org/documentation/v3/mediasoup/rtp-parameters-and-capabilities/#RtpCodecCapability
	// list of media codecs supported by mediasoup ...
	// https://github.com/versatica/mediasoup/blob/v3/src/supportedRtpCapabilities.ts


	peers.on('connection', async socket => {
		const client = new StreamingClient({socket, streamFactory:getCameraById, router});
		client.start();
		socket.on('disconnect', async () => {
			await client.stop();
		})
		return Promise.resolve();
		let consumerTransport = undefined
		console.log(socket.id)
		socket.emit('connection-success', {
			socketId: socket.id
		})

		socket.on('disconnect', () => {
			// do some cleanup
			console.log('peer disconnected')
		})

		// Client emits a request for RTP Capabilities
		// This event responds to the request
		socket.on('getRtpCapabilities', (callback) => {

			const rtpCapabilities = router.rtpCapabilities

			console.log('rtp Capabilities', rtpCapabilities)

			// call callback from the client and send back the rtpCapabilities
			callback({ rtpCapabilities })
		})

		// Client emits a request to create server side Transport
		// We need to differentiate between the producer and consumer transports
		socket.on('createWebRtcTransport', async ({ sender }, callback) => {
			consumerTransport = await createWebRtcTransport(callback)
		})

		// see client's socket.emit('transport-recv-connect', ...)
		socket.on('transport-recv-connect', async ({ dtlsParameters }) => {
			console.log(`DTLS PARAMS: ${dtlsParameters}`)
			await consumerTransport.connect({ dtlsParameters })
		})

		socket.on('consume', async ({ rtpCapabilities, cameraId }, callback) => {
			try {
				const camera = await getCameraById(cameraId)
				if (!router.canConsume({
					producerId: camera.producer.id,
					rtpCapabilities
				})) {
					console.error("❌ Client does not support FFmpeg stream");
					console.log(JSON.stringify(rtpCapabilities, null, 2))
					callback({ error: "Cannot consume stream" });
					return;
				}



				// Create Consumer for the client
				consumer = await consumerTransport.consume({
					producerId: camera.producer.id,
					rtpCapabilities,
					paused: false,
				});

				consumer.on('transportclose', () => {
					console.log("Consumer Transport closed");
				});

				consumer.on('producerclose', () => {
					console.log("FFmpeg Producer closed");
					consumer.close();
				});

				// Send Consumer parameters to the client
				callback({
					params: {
						id: consumer.id,
						producerId: camera.producer.id,
						kind: consumer.kind,
						rtpParameters: consumer.rtpParameters,
					}
				});

			} catch (error) {
				console.error(error.message);
				callback({ error: error.message });
			}
		});


		socket.on('consumer-resume', async () => {
			console.log('consumer resume')
			await consumer.resume()
		})
	})

	const createWebRtcTransport = async (callback) => {
		try {
			// https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportOptions
			const webRtcTransport_options = {
				listenIps: [
					{
						ip: '0.0.0.0', // replace with relevant IP address
						announcedIp: '127.0.0.1',
					}
				],
				enableUdp: true,
				enableTcp: true,
				preferUdp: true,
			}

			// https://mediasoup.org/documentation/v3/mediasoup/api/#router-createWebRtcTransport
			let transport = await router.createWebRtcTransport(webRtcTransport_options)
			console.log(`transport id: ${transport.id}`)

			transport.on('dtlsstatechange', dtlsState => {
				if (dtlsState === 'closed') {
					transport.close()
				}
			})

			transport.on('close', () => {
				console.log('transport closed')
			})

			// send back to the client the following prameters
			callback({
				// https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
				params: {
					id: transport.id,
					iceParameters: transport.iceParameters,
					iceCandidates: transport.iceCandidates,
					dtlsParameters: transport.dtlsParameters,
				}
			})

			return transport

		} catch (error) {
			console.log(error)
			callback({
				params: {
					error: error
				}
			})
		}
	}
})();

