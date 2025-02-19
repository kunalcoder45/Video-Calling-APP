import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

class PeerService {
    constructor() {
        this.peer = null;
        this.remoteSocketId = null;
        this.remoteStreamCallback = null;
        this.initPeer();
    }

    /** Initialize Peer Connection */
    initPeer() {
        if (!this.peer) {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            "stun:stun.l.google.com:19302",
                            "stun:global.stun.twilio.com:3478"
                        ]
                    }
                ]
            });

            this.peer.onicecandidate = this.handleIceCandidate.bind(this);
            this.peer.ontrack = this.handleTrack.bind(this);
            this.peer.onconnectionstatechange = this.handleConnectionStateChange.bind(this);
        }
    }

    /** Handle ICE Candidates */
    handleIceCandidate(event) {
        if (event.candidate && this.remoteSocketId) {
            socket.emit("ice-candidate", { to: this.remoteSocketId, candidate: event.candidate });
        }
    }

    /** Handle Remote Stream */
    handleTrack(event) {
        const [remoteStream] = event.streams;
        console.log("Remote stream received:", remoteStream);

        if (remoteStream && this.remoteStreamCallback) {
            this.remoteStreamCallback(remoteStream);
        }
    }

    /** Handle Connection State Changes */
    handleConnectionStateChange() {
        console.log("Connection state changed:", this.peer.connectionState);
        if (this.peer.connectionState === "failed") {
            console.error("Connection failed. Restarting peer...");
            this.initPeer(); // Reinitialize if failed
        }
    }

    /** Set Remote Socket ID */
    setRemoteSocketId(id) {
        this.remoteSocketId = id;
    }

    /** Set Callback for Remote Stream */
    onRemoteStream(callback) {
        this.remoteStreamCallback = callback;
    }

    /** Create an Offer */
    async getOffer() {
        try {
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(offer);
            return offer;
        } catch (error) {
            console.error("Error creating offer:", error);
            throw error;
        }
    }

    /** Create an Answer */
    async getAnswer(offer) {
        try {
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await this.peer.createAnswer();
            await this.peer.setLocalDescription(answer);
            return answer;
        } catch (error) {
            console.error("Error creating answer:", error);
            throw error;
        }
    }

    /** Set Remote Description */
    async setRemoteDescription(answer) {
        try {
            await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
            console.error("Error setting remote description:", error);
        }
    }

    /** Add Local Stream */
    addLocalStream(stream) {
        try {
            stream.getTracks().forEach(track => {
                this.peer.addTrack(track, stream);
            });
        } catch (error) {
            console.error("Error adding local stream:", error);
        }
    }

    /** Close Peer Connection */
    closeConnection() {
        if (this.peer) {
            this.peer.onicecandidate = null;
            this.peer.ontrack = null;
            this.peer.onconnectionstatechange = null;
            this.peer.close();
            this.peer = null;
        }
    }
}

export default new PeerService();
