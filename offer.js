//accessing video elms
const localVideo = document.querySelectorAll("video")[0]
const remoteVideo = document.querySelectorAll("video")[1]
//senders
var senderVideo, senderMic;
//creating streams var
var localStream = "", remoteStream = "";
//listening for window to load
window.addEventListener("load", () => {
    //creating streams
    localStream = new MediaStream(), remoteStream = new MediaStream();
    //setting streams to video elms
    localVideo.srcObject = localStream
    remoteVideo.srcObject = remoteStream
})
//creating easeRTC obj
const RTC = new EaseRTC()
//listening for ice
RTC.onIce = (e) => {
    localStorage.setItem("offerIce", e)
}
//listening to recieve remote tracks
RTC.onTrack = (e) => {
    //removing old useless Tracks
    const muted = remoteStream.getTracks();
    muted.forEach(track => {
        if (track.muted) {
            remoteStream.removeTrack(track)
        }
    });
    //adding current track
    remoteStream.addTrack(e.track);
    remoteVideo.play();
}
//creating offer
RTC.createOffer().then(e => {
    localStorage.setItem("offerSDP", e)
})
//listening for SDP and ICE
setInterval(() => {
    const SDP = localStorage.getItem("answerSDP");
    if (SDP) {
        console.log(SDP)
        //setting answer SDP
        RTC.acceptAnswer(SDP)
        localStorage.removeItem("answerSDP");
    }
    const ICE = localStorage.getItem("answerIce");
    if (ICE) {
        console.log(ICE)
        //setting ICE
        RTC.addIce(ICE)
        localStorage.removeItem("answerIce");
    }
}, 1000);

//mic on/off and cam on/off part
const mic = document.querySelectorAll("span")[0]
const micOff = document.querySelectorAll("span")[1]
const cam = document.querySelectorAll("span")[2]
const camOff = document.querySelectorAll("span")[3]
micOff.addEventListener("click", () => {
    micOff.style.display = "none"
    mic.style.display = "block"
    RTC.getMedia(true, false).then(str => {
        if (senderMic) {
            RTC.pc.removeTrack(senderMic)
        }
        RTC.addTrack(str.getTracks()[0]).then(e => {
            senderMic = e;
        });
        RTC.reconnectSession()
        const muted = localStream.getTracks();
        muted.forEach(track => {
            if (track.readyState == "ended") {
                localStream.removeTrack(track)
            }
        });
        localStream.addTrack(str.getTracks()[0])
        localVideo.play()
    })
})
mic.addEventListener("click", () => {
    micOff.style.display = "block"
    mic.style.display = "none"
    const muted = localStream.getTracks();
    muted.forEach(track => {
        if (track.muted) {
            localStream.removeTrack(track)
        }
    });
    localStream.getAudioTracks().forEach(track => {
        RTC.pc.removeTrack(senderMic)
        track.stop()
    });
})
camOff.addEventListener("click", () => {
    camOff.style.display = "none"
    cam.style.display ="block"
    RTC.getMedia(false, true).then(str => {
        if (senderVideo) {
            RTC.pc.removeTrack(senderVideo)
        }
        RTC.addTrack(str.getTracks()[0]).then(e => {
            senderVideo = e;
        });;
        RTC.reconnectSession()
        const muted = localStream.getTracks();
        muted.forEach(track => {
            if (track.readyState == "ended") {
                localStream.removeTrack(track)
            }
        });
        localStream.addTrack(str.getTracks()[0])
        localVideo.play()
    })
})
cam.addEventListener("click", () => {
    camOff.style.display = "block"
    cam.style.display = "none"
    const muted = localStream.getTracks();
    muted.forEach(track => {
        if (track.muted) {
            localStream.removeTrack(track)
        }
    });
    localStream.getVideoTracks().forEach(track => {
        RTC.pc.removeTrack(senderVideo)
        track.stop()
    });
})