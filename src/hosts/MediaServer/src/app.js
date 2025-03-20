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
import { spawn } from 'child_process';
import cors from 'cors';


/*/const startGStreamer = () => {
  console.log("Starting GStreamer...");

  const gst = spawn('gst-launch-1.0', [
    'rtspsrc', `location=rtsp://test:Test2025@80.37.229.214:39887/Streaming/Channels/102?transportmode=unicast`,
    'protocols=tcp', 'latency=100', '!',
    'rtph265depay', '!', 'h265parse', '!', 'avdec_h265', '!', // ✅ Decode H265
    'x264enc', 'tune=zerolatency', '!', 'rtph264pay', 'pt=101', 'ssrc=1234567', 'mtu=1200', '!',
    'udpsink', 'host=127.0.0.1', 'port=5004'
  ]);

  gst.stderr.on('data', (data) => {
    console.error(`GStreamer stderr: ${data}`);
  });

  gst.stdout.on('data', (data) => {
    console.log(`GStreamer stdout: ${data}`);
  });

  gst.on('close', (code) => {
    console.log(`GStreamer process exited with code ${code}`);
  });

  gst.on('error', (err) => {
    console.error(`GStreamer error: ${err.message}`);
  });

  return gst;
};

const gstProcess = startGStreamer();*/



// Graceful shutdown
/*process.on('SIGINT', () => {
  console.log('Stopping GStreamer...');
  gstProcess.kill('SIGTERM');
  process.exit();
});*/


const startFFmpeg = () => {
	console.log('Starting FFmpeg...');

	const ffmpeg = spawn('ffmpeg', [
		'-rtsp_transport', 'tcp',
		'-i', 'rtsp://test:Test2025@80.37.229.214:39887/Streaming/Channels/102?transportmode=unicast',
		'-vf', 'scale=1280:720,format=yuv420p',
		'-c:v', 'libx264', '-preset', 'ultrafast', '-tune', 'zerolatency',
		'-profile:v', 'baseline', // ✅ Ensures compatibility
		'-level:v', '3.1',       // ✅ Matches profile-level-id "42e01f"
		'-g', '30', '-r', '30',
		'-pix_fmt', 'yuv420p', '-b:v', '1500k', '-bufsize', '1500k',
		'-payload_type', '101', '-ssrc', '1234567', '-pkt_size', '1200',
		'-f', 'rtp', 'rtp://127.0.0.1:5004',

		'-loglevel', 'warning',  // ✅ Show only warnings and errors
		'-nostats'               // ✅ Hide real-time stats
	]);


	ffmpeg.stdout.on('data', (data) => {
		console.log(`FFmpeg stdout: ${data}`);
	});

	ffmpeg.stderr.on('data', (data) => {
		console.error(`FFmpeg stderr: ${data}`);
	});

	ffmpeg.on('close', (code) => {
		console.log(`FFmpeg process exited with code ${code}`);
	});

	ffmpeg.on('error', (err) => {
		console.error(`FFmpeg error: ${err.message}`);
	});

	return ffmpeg;
};

const ffmpegProcess = startFFmpeg();

// Graceful shutdown
process.on('SIGINT', () => {
	console.log('Stopping FFmpeg...');
	ffmpegProcess.kill('SIGTERM');
	process.exit();
});

app.use(cors({ origin: "https://cerberus-react-ui:5173", credentials: true }));

app.get('/', (req, res) => {
	res.send('Hello from mediasoup app!')
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
let producerTransport
let consumerTransport
let producer
let consumer

let ffmpegTransport
let ffmpegProducer

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
		rtcMaxPort: 22000,
	})
	console.log(`worker pid ${worker.pid}`)

	worker.on('died', error => {
		// This implies something serious happened, so kill the application
		console.error('mediasoup worker has died')
		setTimeout(() => process.exit(1), 2000) // exit in 2 seconds
	})


	return worker
}
const createffmpegTransport = async (router) => {

	const tx = await router.createPlainTransport({
		listenIp: "0.0.0.0", // ✅ Listen on all interfaces
		rtcpMux: true,       // ✅ Use RTCP multiplexing
		comedia: true,       // ✅ Allow remote initiation
		port: 5004,          // ✅ Ensure it matches FFmpeg destination
	});
	console.log(`✅ MediaSoup listening on port ${tx.tuple.localPort}`);

	console.log("📹 Available MediaSoup Codecs:", router.rtpCapabilities.codecs);

	console.log("✅ MediaSoup Listening for RTP at:", tx.tuple.localPort);

	await tx.connect({ ip: "127.0.0.1", port: 5004 });

	console.log("✅ Transport connected to 127.0.0.1:", tx.tuple.localPort);


	return tx;
}
const createffmpegProducer = async (tx) => {

	const videoCodec = router.rtpCapabilities.codecs.find(c => c.mimeType.toLowerCase() === "video/h264");

	if (!videoCodec) {
		console.error("❌ No compatible video codec found!");
		return undefined;
	}
	const  px  = await tx.produce({
		kind: "video",
		rtpParameters: {
			mid: "0",
			codecs: [{
				mimeType: "video/H264",
				clockRate: 90000,
				payloadType: 101,  // ✅ Match FFmpeg
				rtcpFeedback: videoCodec.rtcpFeedback,
				parameters: {
					"packetization-mode": 0,
				}
			}],
			encodings: [{
				ssrc: 1234567  // ✅ Must match FFmpeg
			}]
		}
	});
	return px;
}
(async () => {

	// We create a Worker as soon as our application starts
	worker = await createWorker();
	router = await worker.createRouter({ mediaCodecs, })
	ffmpegTransport = await createffmpegTransport(router);
	ffmpegProducer = await createffmpegProducer(ffmpegTransport);
	// This is an Array of RtpCapabilities
	// https://mediasoup.org/documentation/v3/mediasoup/rtp-parameters-and-capabilities/#RtpCodecCapability
	// list of media codecs supported by mediasoup ...
	// https://github.com/versatica/mediasoup/blob/v3/src/supportedRtpCapabilities.ts


	peers.on('connection', async socket => {
		console.log(socket.id)
		socket.emit('connection-success', {
			socketId: socket.id
		})

		socket.on('disconnect', () => {
			// do some cleanup
			console.log('peer disconnected')
		})

		// worker.createRouter(options)
		// options = { mediaCodecs, appData }
		// mediaCodecs -> defined above
		// appData -> custom application data - we are not supplying any
		// none of the two are required


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
			console.log(`Is this a sender request? ${sender}`)
			// The client indicates if it is a producer or a consumer
			// if sender is true, indicates a producer else a consumer
			if (sender)
				producerTransport = await createWebRtcTransport(callback)
			else
				consumerTransport = await createWebRtcTransport(callback)
		})

		// see client's socket.emit('transport-connect', ...)
		socket.on('transport-connect', async ({ dtlsParameters }) => {
			console.log('DTLS PARAMS... ', { dtlsParameters })
			await producerTransport.connect({ dtlsParameters })
		})

		// see client's socket.emit('transport-produce', ...)
		socket.on('transport-produce', async ({ kind, rtpParameters, appData }, callback) => {
			// call produce based on the prameters from the client
			producer = await producerTransport.produce({
				kind,
				rtpParameters,
			})

			console.log('Producer ID: ', producer.id, producer.kind)

			producer.on('transportclose', () => {
				console.log('transport for this producer closed ')
				producer.close()
			})

			// Send back to the client the Producer's id
			callback({
				id: producer.id
			})
		})

		// see client's socket.emit('transport-recv-connect', ...)
		socket.on('transport-recv-connect', async ({ dtlsParameters }) => {
			console.log(`DTLS PARAMS: ${dtlsParameters}`)
			await consumerTransport.connect({ dtlsParameters })
		})

		socket.on('consume', async ({ rtpCapabilities }, callback) => {
			try {
				// Check if router can consume from FFmpeg
				if (!router.canConsume({
					producerId: ffmpegProducer.id,
					rtpCapabilities
				})) {
					console.error("❌ Client does not support FFmpeg stream");
					console.log(JSON.stringify(rtpCapabilities, null, 2))
					callback({ error: "Cannot consume stream" });
					return;
				}

				// Create Consumer for the client
				consumer = await consumerTransport.consume({
					producerId: ffmpegProducer.id,
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
						producerId: ffmpegProducer.id,
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

