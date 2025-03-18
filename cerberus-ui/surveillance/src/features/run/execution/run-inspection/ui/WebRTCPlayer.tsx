import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";

export default function WebRTCPlayer() {
    const remoteVideoRef = useRef(null);
    const [socket, setSocket] = useState(null);
    const [device, setDevice] = useState(null);
    const [producerTransport, setProducerTransport] = useState(null);
    const [consumerTransport, setConsumerTransport] = useState(null);
    const [producer, setProducer] = useState(null);
    const [consumer, setConsumer] = useState(null);
    const [rtpCapabilities, setRtpCapabilities] = useState(null);

    useEffect(() => {
        if (consumer && remoteVideoRef.current) {
            const stream = new MediaStream();
            stream.addTrack(consumer.track);
            remoteVideoRef.current.srcObject = stream;

            console.log("✅ Remote video assigned:", stream);

            remoteVideoRef.current.play().catch((error) => {
                console.error("❌ Auto-play failed:", error);
            });
        }
    }, [consumer]);

    useEffect(() => {
        const newSocket = io("wss://localhost:3000/mediasoup", {
            transports: ["websocket"],
            timeout: 5000,
            reconnectionAttempts: 5,
            reconnectionDelay: 5000,
        });

        newSocket.on("connect", () => {
            console.log("✅ WebSocket connected!");
        });

        newSocket.on("disconnect", () => {
            console.log("❌ WebSocket disconnected.");
        });

        newSocket.on("connection-success", ({ socketId }) => {
            console.log("✅ Connected to Mediasoup:", socketId);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);


    const getRtpCapabilities = () => {
        if (!socket) return;

        socket.emit("getRtpCapabilities", (data) => {
            console.log("🎯 Received RTP Capabilities:", data.rtpCapabilities);
            setRtpCapabilities(data.rtpCapabilities);
        });
    };

    const createDevice = async () => {
        try {
            if (!rtpCapabilities) {
                console.error("❌ Cannot create device. No RTP capabilities available.");
                return;
            }

            const newDevice = new mediasoupClient.Device();
            await newDevice.load({ routerRtpCapabilities: rtpCapabilities });
            setDevice(newDevice);

            console.log("✅ Mediasoup Device created.");
        } catch (error) {
            console.error("❌ Error creating Mediasoup Device:", error);
        }
    };

    const createRecvTransport = async () => {
        if (!socket || !device) return;

        socket.emit("createWebRtcTransport", { sender: false }, ({ params }) => {
            if (params.error) {
                console.error("❌ Error creating Recv Transport:", params.error);
                return;
            }

            console.log("✅ Recv Transport created:", params);

            const transport = device.createRecvTransport(params);
            setConsumerTransport(transport);

            transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
                socket.emit("transport-recv-connect", { dtlsParameters }, (response) => {
                    if (response?.error) {
                        console.error("❌ Recv Transport connection failed!", response.error);
                        errback(response.error);
                    } else {
                        console.log("✅ Recv Transport connected!");
                        callback();
                    }
                });
                callback();
            });
        });
    };

    const connectRecvTransport = async () => {
        if (!consumerTransport || !socket || !device) return;

        socket.emit("consume", { rtpCapabilities: device.rtpCapabilities }, async ({ params }) => {
            if (params.error) {
                console.error("❌ Error consuming media:", params.error);
                return;
            }

            console.log("✅ Consuming media:", params);

            const newConsumer = await consumerTransport.consume({
                id: params.id,
                producerId: params.producerId,
                kind: params.kind,
                rtpParameters: params.rtpParameters,
            });

            console.log("🎥 Received track:", newConsumer.track);
            console.log("🎥 Kind:", newConsumer.kind);

            setConsumer(newConsumer);

            // ✅ Ensure track is valid
            if (!newConsumer.track) {
                console.error("❌ No track received!");
                return;
            }

            // ✅ Create a new MediaStream and add the track
            const stream = new MediaStream();
            stream.addTrack(newConsumer.track);

            console.log("🎥 MediaStream object:", stream);

            // ✅ Ensure the ref exists before setting
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
                remoteVideoRef.current.muted = false;
                remoteVideoRef.current.volume = 1;

                remoteVideoRef.current.onloadedmetadata = () => {
                    console.log("🎥 Metadata loaded, playing video...");
                    remoteVideoRef.current.play().catch((error) => {
                        console.error("❌ Video play error:", error);
                    });
                };

                console.log("✅ Remote video element updated!");
            } else {
                console.warn("⚠️ Remote video ref is null!");
            }

            // ✅ Resume the consumer
            socket.emit("consumer-resume", { consumerId: newConsumer.id }, (response) => {
                if (response.error) {
                    console.error("❌ Error resuming consumer:", response.error);
                } else {
                    console.log("✅ Consumer resumed successfully!");
                }
            });
        });
    };



    return (
        <div>
            <h3>🎥 WebRTC Player</h3>
            <table>
                <tbody>
                <tr>
                    <td colSpan="2">
                        <div id="sharedBtns">
                            <video ref={remoteVideoRef} className="video" autoPlay playsInline />
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colSpan="2">
                        <div id="sharedBtns">
                            <button onClick={getRtpCapabilities}>2. Get Rtp Capabilities</button>
                            <button onClick={createDevice}>3. Create Device</button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div id="sharedBtns">
                            <button onClick={createRecvTransport}>6. Create Recv Transport</button>
                            <button onClick={connectRecvTransport}>7. Connect Recv Transport & Consume</button>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
