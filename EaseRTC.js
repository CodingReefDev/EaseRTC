/**
   Copyright (c) 2021 Coding Reef

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

   Read More at : https://github.com/CodingReef-Dev/EaseRTC/blob/main/LICENSE
*/

/*       ___   __   ___  _____   ___            ___     ___ 
  \  /  |___  |  | |__     |    |   |  |\ | +   ___|   |   |
   \/   |___  | \  ___|  __|__  |___|  | \| +  |___  + |___|
*/

// 'Stream' - holds the Media Stream of the local-User-Camera
// 'peerC' - holds the RTCPeerConnection Browser API
var Stream, peerC, channels = {}, settings;
class EaseRTC {
    constructor(configuration) {
        // 'configuration' - holds the configuration
        peerC = new RTCPeerConnection(configuration);
    };

    ReconnectDataChannelUID() {
        //creating an uid for data channel
        return 'xxxxxx-xxx-xx-xxxx-x-x-xxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    reconnect() {
        //to reconnect to the user 
        //we create an data channel
        channels.offerChannel = peerC.createDataChannel('ReconnectByOfferer');
        //on opening
        channels.offerChannel.onopen = () => {
            //we create the offer
            easeRTC.createOffer(settings.video, settings.audio).then(offer => {
                console.log('created reconnect offer');
                //then we send it
                channels.offerChannel.send(JSON.stringify({ sdp: offer.offer }));
                //PASS
            })
        }
        //then when we get answer SDP
        channels.offerChannel.onmessage = (msg) => {
            //we set it
            easeRTC.connectToAnswer(JSON.parse(msg.data).sdp)
        }
    }
    setUpReconnect() {
        //set up on the remote end
        //when a channel is created
        peerC.ondatachannel = (channelHolder) => {
            //we create a ref to the channel
            var datachan = channelHolder.channel;
            //then on message
            datachan.onmessage = (msg) => {
                //we check if its an offer
                if (JSON.parse(JSON.parse(msg.data).sdp).type == "offer") {
                    //then we create an answer
                    easeRTC.createAnswer(JSON.parse(msg.data).sdp, settings.video, settings.audio).then(ans => {
                        //and we send it
                        datachan.send(JSON.stringify({ sdp: ans.answer }));
                        //PASS
                    })
                }
                //if its answer SDP
                if (JSON.parse(JSON.parse(msg.data).sdp).type == "answer") {
                    //we connect to it
                    easeRTC.connectToAnswer(msg.data.sdp);
                }
            }
        }
    }
    createAnswer(offerSDP, video, audio) {
        // 'offerSDP' - holds the value of the offerer SDP
        // 'video' and 'audio' - holds the value requried for creating the answerer's stream
        // 'twice' - is used to store boolean which is used to check if the localDescription is set
        //setting the inputted values for video and audio
        const constraints = { video: video, audio: audio };
        settings = constraints;
        //creating a promise
        return new Promise(async (resolve, reject) => {
            //getting the user's 
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            //setting val for 'Stream' as the local media stream
            Stream = stream;
            //setting the obtained media stream to the connection 
            for (const track of stream.getTracks()) {
                await peerC.addTrack(track, stream);
            }
            //waiting for the stream to be added to the connection
            await (peerC.onnegotiationneeded = async () => {
                //we just create an use less data channel just to create another later
                channels[easeRTC.ReconnectDataChannelUID()] = await peerC.createDataChannel('ReconnectionCenter');
                //we just listen to the useless data channel
                peerC.addEventListener('datachannel', easeRTC.handelNewRTCDataChannel);
                //setting remoteDescription
                await peerC.setRemoteDescription(JSON.parse(offerSDP));
                //creating answer and setting the answer to the localDescription
                await peerC.createAnswer().then(async ans => {
                    await peerC.setLocalDescription(new RTCSessionDescription((ans)));
                });
                //WE ARE REPEATING THE SAME
                //beacuse, to stop the error which occures when  testing the 2 connections on one device

                //setting remoteDescription
                await peerC.setRemoteDescription(JSON.parse(offerSDP));
                //creating answer and setting the answer to the localDescription
                await peerC.createAnswer().then(async ans => {
                    await peerC.setLocalDescription(new RTCSessionDescription((ans)));
                });
                resolve({ answer: JSON.stringify(peerC.localDescription), stream: Stream });
            });
        })
    }
    createOffer(video, audio) {

        return new Promise(async (resolve, reject) => {
            // 'video' and 'audio' - holds the value requried for creating the offerer's stream
            //calling function
            await createOffer(video, audio);
            async function createOffer(video, audio) {
                //setting the inputted values for video and audio
                const constraints = { audio: audio, video: video };
                settings = constraints;
                //getting the user's requested media stream
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                //setting val for 'Stream' as the local media stream
                Stream = stream
                //setting the obtained media stream to the connection 
                for (const track of stream.getTracks()) {
                    await peerC.addTrack(track, stream);
                }
                //waiting for the stream to be added to the connection
                await (peerC.onnegotiationneeded = async () => {
                    //we just create an use less data channel just to create another later
                    channels[easeRTC.ReconnectDataChannelUID()] = await peerC.createDataChannel('ReconnectionCenter');
                    //we just listen to the useless data channel
                    peerC.addEventListener('datachannel', easeRTC.handelNewRTCDataChannel);
                    //trying to create an offer and set it as localDescription
                    await peerC.setLocalDescription();
                    //returning the localDescription and the local stream
                    resolve({ offer: JSON.stringify(peerC.localDescription), stream: Stream });
                });
            }
        })
    }
    //this is just temp
    handelNewRTCDataChannel(event) { }

    connectToAnswer(answerSDP) {
        //we set the remoteDescrtiption
        peerC.setRemoteDescription(JSON.parse(answerSDP))
    }

    async changeTrack(audio, video) {
        // 'video' and 'audio' - holds the value requried for creating the offerer's stream
        //we get the media streams as requested
        const stream = await navigator.mediaDevices.getUserMedia({ audio: audio, video: video });
        //then we change the tracks
        for (const track of stream.getTracks()) {
            await peerC.addTrack(track, stream);
        }
        //and we return the tracks
        return stream;
    }

    async getTrack() {
        //this is to get the other user's tracks
        return new Promise((resolve, reject) => {
            try {
                //we try to get the tracks
                peerC.ontrack = ({ track, streams }) => {
                    //once got, we return the other user's stream 
                    resolve(streams[0]);
                };
            } catch {
                //if there was an error
                reject("there was an error getting the other user's tracks");
            }
        })
    }

    async getMedia(audio, video) {
        //this is used to only get the user's media.
        return new Promise(async (resolve, reject) => {
            try {
                //trying to get the requested media
                const stream = await navigator.mediaDevices.getUserMedia({ audio: audio, video: video });
                //then we return the stream
                resolve(stream);
            } catch
            {
                //else we :
                reject("This User Dosen't have the requested device or the config for audio or video is wrong")
            }
        })
    }
}