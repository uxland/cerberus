import { useEffect, useState } from "react";
import io from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";

export default function WebRTCPlayer() {
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);


    useEffect(() => {
        const socket = io("ws://host.docker.internal:3000", { // ✅ Ensure WebSocket URL matches server
            transports: ["websocket"],
            timeout: 5000,
            reconnectionAttempts: 5,
        });
        socket.on("connect", async () => {
            console.log("✅ WebSocket connected!");

            try {
                const device = new mediasoupClient.Device();

                // Get router capabilities
                socket.emit("getRouterRtpCapabilities", async (capabilities: any) => {
                    if (!capabilities || !capabilities.codecs || capabilities.codecs.length === 0) {
                        console.error("❌ Error: Invalid Router RTP Capabilities!", capabilities);
                        return;
                    }

                    console.log("✅ Received Router Capabilities:", capabilities);
                    await device.load({ routerRtpCapabilities: capabilities });

                    // Create RecvTransport
                    socket.emit("createTransport", async (transportData: any) => {
                        if (!transportData || !transportData.dtlsParameters) {
                            console.error("❌ Error: RecvTransport did not provide DTLS parameters!", transportData);
                            return;
                        }

                        console.log("✅ Received RecvTransport data:", transportData);

                        const transport = device.createRecvTransport(transportData);

                        transport.on("connect", ({ dtlsParameters }, callback) => {
                            console.log("✅ RecvTransport connected. DTLS:", dtlsParameters);
                            socket.emit("connectTransport", { transportId: transport.id, dtlsParameters });
                            callback();
                        });

                        // Request to consume the existing stream
                        socket.emit(
                            "consume",
                            {
                                transportId: transport.id,
                                producerId: "video", // ✅ Use stored producer ID from the server
                                rtpCapabilities: device.rtpCapabilities,
                            },
                            async (consumerData: any) => {
                                if (!consumerData || !consumerData.id) {
                                    console.error("❌ Error: Consumer data is invalid!", consumerData);
                                    return;
                                }

                                console.log("✅ Received consumer data:", consumerData);
                                const consumer = await transport.consume(consumerData);
                                const stream = new MediaStream();
                                stream.addTrack(consumer.track);
                                setVideoStream(stream);
                            }
                        );
                    });
                });
            } catch (error) {
                console.error("❌ WebRTC initialization error:", error);
            }
        });

        return () => {
            socket.off("connect");
        };
    }, []);

    return (
        <div>
            <h3>🎥 Live Stream</h3>
            <video
                autoPlay
                playsInline
                muted
                ref={(video) => {
                    if (video && videoStream) video.srcObject = videoStream;
                }}
            />
        </div>
    );
}
