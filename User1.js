const configuration = {iceServers: [
    {
        urls:
            [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302",
            ]
    }
]
};
var easeRTC = new EaseRTC(configuration);
easeRTC.getTrack().then(stream=>{
    console.log(stream);
    document.getElementById('remote').srcObject=stream;
})
easeRTC.createOffer(true, true).then(offer=>{    
    document.getElementById('offer').value = offer.offer
    document.getElementById('local').srcObject=offer.stream;
})
async function addAnswer(){
    await easeRTC.connectToAnswer(document.getElementById('answer').value);
}