class EaseRTC {
    constructor(configuation, offerOptions, answerOptions) {
        this.pc = new RTCPeerConnection(configuation);
        this.offerOptions = offerOptions
        this.answerOptions = answerOptions
        this.EaseRTCReconnectionChannel = ""
        this.pc.ontrack = (e) => {
            this.onTrack(e);
        }
        this.pc.onicecandidate = (event) => {
            event.candidate && this.onIce(JSON.stringify(event.candidate));
        };
    }
    getRTCObject() {
        return this.pc;
    }
    onIce() { }
    onTrack() { }
    addIce(iceCandidate = new RTCIceCandidate()) {
        this.pc.addIceCandidate(new RTCIceCandidate(JSON.parse(iceCandidate)));
    }
    addTrack(track) {
        return new Promise(async(res, rej)=>{
            const sender = this.pc.addTrack(track);
            res(sender)
        })
    }
    createOffer() {
        return new Promise(async (res, rej) => {
            try {
                this.EaseRTCReconnectionChannel = this.pc.createDataChannel("EaseRTCReconnectionChannel");
                this.EaseRTCReconnectionChannel.onmessage = (e) => {
                    const SDP = JSON.parse(e.data);
                    if (SDP.type == "offer") {
                        this.createAnswer(e.data).then(answer => {
                            this.EaseRTCReconnectionChannel.send(answer)
                        });
                    }
                    if (SDP.type == "answer") {
                        this.acceptAnswer(e.data);
                    }
                }
            } catch (error) {
                rej("Error while creating reconnection data channel");
            }
            try {
                await this.pc.createOffer(this.offerOptions).then(async offer => {
                    await this.pc.setLocalDescription(new RTCSessionDescription(offer));
                    await res(JSON.stringify(offer));
                })
            } catch (error) {
                await rej("Error while creating offer");
            }
        })
    }
    createAnswer(offer = new RTCSessionDescription()) {
        return new Promise(async (res, rej) => {
            this.pc.ondatachannel = (e) => {
                if (e.channel.label == "EaseRTCReconnectionChannel") {
                    this.EaseRTCReconnectionChannel = e.channel;
                    this.EaseRTCReconnectionChannel.onmessage = (e) => {
                        const SDP = JSON.parse(e.data);
                        if (SDP.type == "offer") {
                            this.createAnswer(e.data).then(answer => {
                                this.EaseRTCReconnectionChannel.send(answer)
                            });
                        }
                        if (SDP.type == "answer") {
                            this.acceptAnswer(e.data);
                        }
                    }
                }
            }
            try {
                await this.pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
            } catch (error) {
                rej("Error while setting offer SDP", error)
            }
            try {
                await this.pc.createAnswer(this.answerOptions).then(async answer => {
                    await this.pc.setLocalDescription(new RTCSessionDescription(answer));
                    await res(JSON.stringify(answer));
                })
            } catch (error) {
                await rej("Error while creating answer", error);
            }
        })
    }
    acceptAnswer(answer = new RTCSessionDescription()) {
        try {
            this.pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
        } catch (error) {
            console.error("error while setting remote desc", error)
        }
    }
    reconnectSession() {
        this.pc.createOffer(this.offerOptions).then(async offer => {
            await this.pc.setLocalDescription(new RTCSessionDescription(offer));
            if (this.EaseRTCReconnectionChannel.readyState == "open") {
                this.EaseRTCReconnectionChannel.send(JSON.stringify(offer))
            } else {
                this.EaseRTCReconnectionChannel.addEventListener("open", () => {
                    this.EaseRTCReconnectionChannel.send(JSON.stringify(offer))
                })
            }
        })
    }
    getMedia(audioOptions = new Boolean, videoOptions = new Boolean) {
        return new Promise(async (res, rej) => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: audioOptions, video: videoOptions });
                res(stream);
            } catch {
                rej("This User Dosen't have the requested device or the config for audio or video is wrong")
            }
        })
    }
}