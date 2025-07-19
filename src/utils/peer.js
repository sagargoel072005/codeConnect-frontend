class PeerService {
  constructor(socket, remoteSocketId) {
    this.peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // Optional TURN servers here
      ]
    });

    this.socket = socket;
    this.remoteSocketId = remoteSocketId;
    this.onTrack = null;
    this.pendingCandidates = [];

this.peer.onicecandidate = (event) => {
  if (event.candidate && this.remoteSocketId) {
    this.socket.emit("ice-candidate", {
      to: this.remoteSocketId,
      candidate: event.candidate,
    });
  }
};


    this.peer.ontrack = (event) => {
      console.log("📡 Got remote stream!");
      if (this.onTrack) {
        this.onTrack(event);
      }
    };

    this.peer.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", this.peer.iceConnectionState);
    };
  }

  setOnTrackCallback(callback) {
    this.onTrack = callback;
  }

  async getOffer() {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    return offer;
  }

async getAnswer() {
  const ans = await this.peer.createAnswer();
  await this.peer.setLocalDescription(ans);
  return ans;
}


  async setRemoteDescription(ans) {
    await this.peer.setRemoteDescription(ans);
    // ✅ Flush pending candidates
    for (const candidate of this.pendingCandidates) {
      try {
        await this.peer.addIceCandidate(candidate);
      } catch (e) {
        console.error("Failed to add flushed ICE candidate", e);
      }
    }
    this.pendingCandidates = [];
  }

  async addIceCandidate(candidate) {
    if (this.peer.remoteDescription) {
      try {
        await this.peer.addIceCandidate(candidate);
      } catch (err) {
        console.error("Failed to add ICE candidate:", err);
      }
    } else {
      // ✅ Queue until remote description is set
      this.pendingCandidates.push(candidate);
    }
  }
}


export default PeerService;




/*import { Peer } from "peerjs"; //npm install peerjs socket.io-client

class PeerService {
  constructor() {
    if (!PeerService.instance) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      });

      PeerService.instance = this;
    }

    return PeerService.instance;
  }

  async getOffer() {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  }

  async getAnswer(offer) {
    await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peer.createAnswer();
    await this.peer.setLocalDescription(new RTCSessionDescription(answer));
    return answer;
  }

  async setRemoteAnswer(answer) {
    await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
  }

  async addTrack(stream) {
    stream.getTracks().forEach((track) => {
      this.peer.addTrack(track, stream);
    });
  }
}

export default new PeerService();
*/