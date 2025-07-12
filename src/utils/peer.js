import { Peer } from "peerjs"; //npm install peerjs socket.io-client

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
