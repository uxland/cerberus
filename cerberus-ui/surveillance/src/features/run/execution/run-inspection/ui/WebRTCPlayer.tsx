import React, { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import {keycloak, nop} from "@cerberus/core";
// @ts-ignore
const streamingUrl = `${import.meta.env.VITE_CERBERUS_STREAMING_URL}/api/signaling-hub`;

export default function WebRTCPlayer({ cameraId }: { cameraId: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    useEffect(() => {
        const initConnection = async () => {
            if(connection) return;
            const connect = new signalR.HubConnectionBuilder()
                .withUrl(streamingUrl, {
                    accessTokenFactory: () => keycloak.token,
                }) // Adjust to your backend URL
                .withAutomaticReconnect()
                .build();
             try {
                await connect.start();
                setConnection(connect);
             }
             catch (e) {
                 console.error("❌ SignalR connection failed:", e);
             }
            connect.on("ReceiveAnswer", async (sdpAnswer: string) => {
                if (peerConnection) {
                    const desc = new RTCSessionDescription({ type: "answer", sdp: sdpAnswer });
                    await peerConnection.setRemoteDescription(desc);
                    console.log("✅ SDP answer set");
                }
            });
        }
        initConnection().then(nop);
        return () => {
            connection?.stop();
        };
    }, [cameraId]);

    useEffect(() => {
        if (!connection || peerConnection) return;

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        setPeerConnection(pc);

        pc.ontrack = (event) => {
            if (videoRef.current) {
                videoRef.current.srcObject = event.streams[0];
                console.log("🎥 Remote stream assigned");
            }
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                connection.invoke("SendIceCandidate", cameraId, event.candidate.candidate);
            }
        };

        const start = async () => {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            connection.invoke("SendOffer", cameraId, offer.sdp);
        };

        start();
    }, [connection]);

    return (
        <div>
            <h3>🎥 WebRTC Player (SignalR)</h3>
            <video ref={videoRef} autoPlay playsInline muted className="video" />
        </div>
    );
}
