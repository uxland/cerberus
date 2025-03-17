import { useEffect, useState } from "react";
import io from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";

export default function WebRTCPlayer() {
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const socket = io("wss://localhost:3000", { // ✅ Ensure WebSocket URL matches server
        transports: ["websocket"],
        timeout: 5000,
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,

    });

    useEffect(() => {
        if (!videoStream) return;

        const videoTrack = videoStream.getVideoTracks()[0];
        console.log("🎥 Checking video track settings:", videoTrack.getSettings());

        const interval = setInterval(() => {
            console.log(
                "📸 Track readyState:", videoTrack.readyState,
                "| Muted:", videoTrack.muted,
                "| Enabled:", videoTrack.enabled
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [videoStream]);
    useEffect(() => {

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
                            console.log("🔄 Attempting to connect transport...");
                            console.log("🔹 DTLS Parameters:", dtlsParameters);

                            socket.emit("connectTransport", { transportId: transport.id, dtlsParameters }, (response) => {
                                if (response?.error) {
                                    console.error("❌ Transport connection failed!", response.error);
                                } else {
                                    console.log("✅ Transport successfully connected!");
                                }
                            });

                            callback(); // Notify mediasoup
                        });

                        // Request to consume the existing stream
                        socket.emit(
                            "consume",
                            {
                                transportId: transport.id,
                                producerId: "video",
                                rtpCapabilities: device.rtpCapabilities,
                            },
                            async (consumerData) => {
                                if (!consumerData || consumerData.error) {
                                    console.error("❌ Error: Consumer data is invalid!", consumerData);
                                    return;
                                }

                                console.log("✅ Received consumer data:", consumerData);

                                // ✅ Create the Consumer
                                const consumer = await transport.consume(consumerData);

                                // ✅ Ensure Consumer is Resumed
                                socket.emit("resumeConsumer", { consumerId: consumer.id }, (response) => {
                                    if (response.error) {
                                        console.error("❌ Error resuming consumer:", response.error);
                                        return;
                                    }
                                    console.log("✅ Consumer Resumed Successfully!");
                                });

                                // ✅ Attach the received track to a MediaStream
                                const stream = new MediaStream();
                                stream.addTrack(consumer.track);
                                console.log("✅ Received MediaStream:", stream); // Add this log
                                // ✅ Assign the stream to the video element
                                setVideoStream(stream);

                                console.log("✅ Video track added to MediaStream:", stream);
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
                id="remote-video"
                autoPlay
                playsInline
                muted
                ref={(video) => {
                    if (video && videoStream) {
                        video.srcObject = videoStream;
                        console.log("✅ Video element assigned stream!", video);

                        const tracks = videoStream.getVideoTracks();
                        console.log("🎥 Video tracks in stream:", tracks);

                        if (tracks.length === 0) {
                            console.error("❌ No video tracks found in MediaStream!");
                            return;
                        }

                        // Ensure the track is enabled
                        tracks[0].enabled = true;

                        // Unmute video element (not track)
                        video.muted = false;
                        video.volume = 1;

                        // Force play after metadata loads
                        video.onloadedmetadata = () => {
                            console.log("🎥 Video metadata loaded, trying to play...");
                            video.play().catch((error) => {
                                console.error("❌ Video play error:", error);
                            });
                        };

                        // Force play when the track is unmuted
                        tracks[0].onunmute = () => {
                            console.log("🎥 Track unmuted, attempting to play...");
                            video.play().catch((error) => console.error("❌ Play error after unmute:", error));
                        };
                    }
                }}


            />

        </div>
    );
}
