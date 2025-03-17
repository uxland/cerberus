const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mediasoup = require("mediasoup");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

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

	transport = await router.createPlainTransport({
		listenIp: "0.0.0.0",
		rtcpMux: false,
		comedia: true,
	});

	console.log("✅ Listening for RTP at:", transport.tuple.localPort);
	await transport.connect({ ip: "127.0.0.1", port: 5004 }); // ✅ Ensure FFmpeg is sending RTP here

	// Create a producer when FFmpeg starts streaming
	producer = await transport.produce({ kind: "video", rtpParameters: {} });
	producers.video = producer.id; // Store producer ID

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
				if (!router.canConsume({ producerId: producers[producerId], rtpCapabilities })) {
					callback({ error: "Cannot consume the producer" });
					return;
				}

				const consumer = await router.createTransport(transportId).consume({
					producerId: producers[producerId],
					rtpCapabilities,
					paused: false,
				});

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
	});

	server.listen(3000, () => console.log("✅ MediaSoup WebSocket server running on port 3000"));
})();
