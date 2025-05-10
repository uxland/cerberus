import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import {container} from "../../../ioc";
import {ApiClient} from "@cerberus/shared/src";
import {nop} from "../../../utils";

// @ts-ignore
//const streamingUrl = `${import.meta.env.VITE_CERBERUS_STREAMING_URL}/mediasoup`;

interface StreamInfo{
    streamUrl: string;
}

const getStreamInfo = async (cameraId: string) => {
    const apiClient = container.get(ApiClient);
    const streamInfo = await apiClient.put<StreamInfo>(`organizational-structure/cameras/${cameraId}:join-stream`, {})
    return streamInfo;
};

export function WebRTCPlayer({ cameraId }: { cameraId: string }) {
    const remoteVideoRef = useRef(null);
    const [socket, setSocket] = useState(null);
    const [device, setDevice] = useState(null);
    const [consumerTransport, setConsumerTransport] = useState(null);
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

    useEffect( () => {
        const connect = async () => {
            const {streamUrl} = await getStreamInfo(cameraId);
            const newSocket = io(streamUrl, {
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
                setSocket(newSocket);
            });
        }

        if(!socket)
            connect().then(nop);
        return () => {
            socket?.disconnect();
        };

    }, [cameraId, socket]);

    useEffect(() => {
        const connect = async () =>{
            const capabilities = await getRtpCapabilities();
            const device = await createDevice(capabilities);
            const consumerTransport = await createRecvTransport(socket, device);
            const consumer = await connectRecvTransport(consumerTransport, socket, device);
            connectStream(consumer);
            resumeStream(consumer);
        }
        socket && connect().then(nop)
    }, [socket]);

    const resumeStream = (consumer) => {
        socket.emit("consumer-resume", { consumerId: consumer.id });
    }
    const connectStream = (consumer =>{
        const stream = new MediaStream();
        stream.addTrack(consumer.track);

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

    })

    const getRtpCapabilities = () => {
        if (!socket) return Promise.resolve();
        return new Promise((resolve) => {
            socket.emit("getRtpCapabilities", (data) => {
                console.log("🎯 Received RTP Capabilities:", data.rtpCapabilities);
                setRtpCapabilities(data.rtpCapabilities);
                resolve(data.rtpCapabilities);
            });
        });
    };

    const createDevice = async (capabilities) => {
        try {
            if (!capabilities) {
                console.error("❌ Cannot create device. No RTP capabilities available.");
                return;
            }

            const newDevice = new mediasoupClient.Device();
            await newDevice.load({ routerRtpCapabilities: capabilities });
            setDevice(newDevice);
            console.log("✅ Mediasoup Device created.");
            return newDevice;
        } catch (error) {
            console.error("❌ Error creating Mediasoup Device:", error);
            throw error;
        }
    };

    const createRecvTransport = (socket, device) => {
        if (!socket || !device) return Promise.resolve(undefined);
        return new Promise((resolve, fail) => {
            socket.emit("createWebRtcTransport", { sender: false }, ({ params }) => {
                if (params.error) {
                    console.error("❌ Error creating Recv Transport:", params.error);
                    resolve(undefined);
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
                resolve(transport);
            });
        })

    };

    const connectRecvTransport = (consumerTransport, socket, device) => {
        if (!consumerTransport || !socket || !device) Promise.resolve(undefined);
        return new Promise((resolve, fail) => {
            socket.emit("consume", {cameraId, rtpCapabilities: device.rtpCapabilities, record: true }, async ({ params }) => {
                if (params.error) {
                    console.error("❌ Error consuming media:", params.error);
                    fail(params.error);
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
                    fail("No track received!");
                    return;
                }
                resolve(newConsumer);
                return;

            });
        })

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
                </tbody>
            </table>
        </div>
    );
}
