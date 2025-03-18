const express = require("express");
const fs = require("fs");
const https = require("http");
const socketIo = require("socket.io");
const mediasoup = require("mediasoup");
const cors = require("cors");

const app = express();
/*const options = {
	key: fs.readFileSync("/certs/privkey.pem"),  // ✅ Use the generated key
	cert: fs.readFileSync("/certs/fullchain.pem"),  // ✅ Use the generated certificate
};*/
const server = https.createServer(app);

const transports = new Map(); // ✅ Store transports by their ID

const consumers = new Map(); // ✅ Store all consumers

const io = socketIo(server, {
	cors: {
		origin: "https://cerberus-react-ui:5173",  // ✅ Fixed CORS issue
		methods: ["GET", "POST"],
		credentials: true,
	},
	transports: ["websocket", "polling"], // ✅ Ensure WebSocket transport is enabled
});

// Allow CORS for Express
app.use(cors({ origin: "https://cerberus-react-ui:5173", credentials: true }));

let worker, router, transport, producer;
const producers = {}; // Store producer IDs

(async () => {
	worker = await mediasoup.createWorker();
	router = await worker.createRouter({
		mediaCodecs: [
			{ kind: "audio", mimeType: "audio/opus", clockRate: 48000, channels: 2 },
			{ kind: "video", mimeType: "video/h264", clockRate: 90000, parameters: { "packetization-mode": 1 } },
		],
	});

	const transport = await router.createPlainTransport({
		listenIp: "0.0.0.0", // ✅ Listen on all interfaces
		rtcpMux: true,       // ✅ Use RTCP multiplexing
		comedia: true,       // ✅ Allow remote initiation
		port: 5004,          // ✅ Ensure it matches FFmpeg destination
	});
	console.log(`✅ MediaSoup listening on port ${transport.tuple.localPort}`);

	console.log("📹 Available MediaSoup Codecs:", router.rtpCapabilities.codecs);

	console.log("✅ MediaSoup Listening for RTP at:", transport.tuple.localPort);

	await transport.connect({ ip: "127.0.0.1", port: 5004 });

	console.log("✅ Transport connected to 127.0.0.1:", transport.tuple.localPort);

	const videoCodec = router.rtpCapabilities.codecs.find(c => c.mimeType.toLowerCase() === "video/h264");

	if (!videoCodec) {
		console.error("❌ No compatible video codec found!");
		return;
	}

// ✅ Ensure SSRC is explicitly set
	/*producer = await transport.produce({
		kind: "video",
		rtpParameters: {
			mid: "0",
			codecs: [{
				mimeType: videoCodec.mimeType,
				clockRate: videoCodec.clockRate,
				payloadType: videoCodec.preferredPayloadType,
				rtcpFeedback: videoCodec.rtcpFeedback,
				parameters: {
					...videoCodec.parameters,
					"packetization-mode": 1,  // ✅ Ensure proper fragmentation handling
					"profile-level-id": "42e01f"  // ✅ Baseline H264 profile (safe for WebRTC)
				}
			}],
			encodings: [{
				ssrc: 1234567
			}]
		}
	});*/
	producer = await transport.produce({
		kind: "video",
		rtpParameters: {
			mid: "0",
			codecs: [{
				mimeType: "video/H264",
				clockRate: 90000,
				payloadType: 101,  // ✅ Match FFmpeg
				rtcpFeedback: videoCodec.rtcpFeedback,
				parameters: videoCodec.parameters
			}],
			encodings: [{
				ssrc: 1234567  // ✅ Must match FFmpeg
			}]
		}
	});

	setInterval(async () => {
		if (producer) {
			const stats = await producer.getStats();
			console.log("📊 Producer Stats:", stats.length ? stats : "❌ No RTP packets received.");

			if (stats.length > 0) {
				stats.forEach((s) => {
					console.log(`✅ Producer ${s.type}: packetsSent=${s.packetsSent}, bitrate=${s.bitrate}`);
				});
			}
		}
	}, 5000);

	producers["video"] = producer;

	console.log("✅ Producer created:", producer.id);

	io.on("connection", (socket) => {
		console.log("✅ Client connected via WebSocket!");

		socket.on("getRouterRtpCapabilities", (callback) => {
			console.log("✅ Sending Router RTP Capabilities");
			callback(router.rtpCapabilities);
		});

		socket.on("createTransport", async (callback) => {
			try {
				const webRtcTransport = await router.createWebRtcTransport({
					listenIps: [{ ip: "0.0.0.0", announcedIp: "your-public-ip" }], // Replace with your public IP if needed
					enableUdp: true,
					enableTcp: true,
					preferUdp: true,
				});

				// ✅ Store transport in a Map
				transports.set(webRtcTransport.id, webRtcTransport);

				console.log("✅ WebRTC Transport created:", webRtcTransport.id);

				callback({
					id: webRtcTransport.id,
					iceParameters: webRtcTransport.iceParameters,
					iceCandidates: webRtcTransport.iceCandidates,
					dtlsParameters: webRtcTransport.dtlsParameters,
				});
			} catch (error) {
				console.error("❌ Error creating WebRTC Transport:", error);
				callback({ error: error.message });
			}
		});

		socket.on("consume", async ({ transportId, producerId, rtpCapabilities }, callback) => {
			try {
				const producer = producers[producerId]; // ✅ Get the producer
				if (!producer) {
					console.error("❌ Error: Producer not found for ID:", producerId);
					return callback({ error: "Producer not found" });
				}

				if (!router.canConsume({ producerId: producer.id, rtpCapabilities })) {
					console.error("❌ Cannot consume this producer!");
					return callback({ error: "Cannot consume the producer" });
				}

				// ✅ Retrieve the correct transport
				const transport = transports.get(transportId);
				if (!transport) {
					console.error("❌ Transport not found for ID:", transportId);
					return callback({ error: "Transport not found" });
				}

				// ✅ Create the consumer
				const consumer = await transport.consume({
					producerId: producer.id,
					rtpCapabilities,
					paused: true,
				});

				// ✅ Store consumer in Map
				consumers.set(consumer.id, consumer);

				console.log("✅ Consumer created:", consumer.id);

				callback({
					id: consumer.id,
					producerId: consumer.producerId,
					kind: consumer.kind,
					rtpParameters: consumer.rtpParameters,
				});
			} catch (error) {
				console.error("❌ Error creating consumer:", error);
				callback({ error: error.message });
			}
		});


		socket.on("resumeConsumer", async ({ consumerId }, callback) => {
			try {
				const consumer = consumers.get(consumerId);
				if (!consumer) {
					console.error("❌ Consumer not found:", consumerId);
					return callback({ error: "Consumer not found" });
				}

				await consumer.resume();
				console.log("✅ Consumer Resumed:", consumer.id);

				callback({ success: true });
			} catch (error) {
				console.error("❌ Error resuming consumer:", error);
				callback({ error: error.message });
			}
		});

	});

	server.listen(3000, () => console.log("✅ MediaSoup WebSocket server running on port 3000"));
})();
