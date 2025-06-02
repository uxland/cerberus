export const createTransport = async (router, port) => {

	const tx = await router.createPlainTransport({
		listenIp: "0.0.0.0", // ✅ Listen on all interfaces
		rtcpMux: true,       // ✅ Use RTCP multiplexing
		comedia: true,       // ✅ Allow remote initiation
		port,
	});
	console.log(`✅ MediaSoup listening on port ${tx.tuple.localPort}`);

	console.log("📹 Available MediaSoup Codecs:", router.rtpCapabilities.codecs);

	console.log("✅ MediaSoup Listening for RTP at:", tx.tuple.localPort);

	await tx.connect({ ip: "127.0.0.1", port });

	console.log("✅ Transport connected to 127.0.0.1:", tx.tuple.localPort);


	return tx;
}
export const createProducer = async (transport, router) => {

	const videoCodec = router.rtpCapabilities.codecs.find(c => c.mimeType.toLowerCase() === "video/h264");

	if (!videoCodec) {
		console.error("❌ No compatible video codec found!");
		return undefined;
	}
	return await transport.produce({
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
}