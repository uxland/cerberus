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
        const start = async () => {
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
            });

            // 👇 THIS IS THE FIX
            pc.addTransceiver('video', { direction: 'recvonly' });

            function preferH264(sdp: string): string {
                const lines = sdp.split('\r\n');
                let mLineIndex = lines.findIndex(line => line.startsWith('m=video'));
                if (mLineIndex === -1) {
                    console.warn('No video m= line found!');
                    return sdp;
                }

                // Parse original m=video line
                const mLineParts = lines[mLineIndex].split(' ');
                const mHeader = mLineParts.slice(0, 3).join(' ');

                // H264 payload types to keep
                const allowedPayloads = [];

                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].startsWith('a=rtpmap:')) {
                        const match = lines[i].match(/^a=rtpmap:(\d+) H264\/90000/i);
                        if (match) {
                            allowedPayloads.push(match[1]);
                        }
                    }
                }

                if (allowedPayloads.length === 0) {
                    console.warn('No H264 payloads found in SDP!');
                    return sdp;
                }

                // Rewrite m=video line with only allowed payloads
                lines[mLineIndex] = `${mHeader} ${allowedPayloads.join(' ')}`;

                // Filter all lines: only keep related to allowed payloads or non-payload lines
                const filteredLines = lines.filter(line => {
                    if (line.startsWith('a=rtpmap:') || line.startsWith('a=fmtp:') || line.startsWith('a=rtcp-fb:')) {
                        const pt = line.split(':')[1].split(' ')[0];
                        return allowedPayloads.includes(pt);
                    }
                    return true;
                });

                return filteredLines.join('\r\n');
            }

            const offer = await pc.createOffer();
            offer.sdp = preferH264(offer.sdp);
            await pc.setLocalDescription(offer);

            connection.invoke("SendOffer", cameraId, offer.sdp);

            setPeerConnection(pc);
        };
        if (connection) start();
    }, [connection, cameraId]);

    return (
        <div>
            <h3>🎥 WebRTC Player (SignalR)</h3>
            <video ref={videoRef} autoPlay playsInline muted className="video" />
        </div>
    );
}
