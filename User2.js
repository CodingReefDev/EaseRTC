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
easeRTC = new EaseRTC(configuration)
easeRTC.getTrack().then(stream=>{
    console.log(stream)
    document.getElementById('remote').srcObject=stream;
})
function Connect(){
    var offer = document.getElementById('offer').value;
    easeRTC.createAnswer(offer, true, true).then(ans=>{
        document.getElementById('answer').value =ans.answer;
        document.getElementById('local').srcObject=ans.stream;
    })
}