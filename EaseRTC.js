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

// 'Stream' - holds the Media Stream of the local-User-Camera
// 'peerC' - holds the RTCPeerConnection Browser API
var Stream, peerC;
class EaseRTC {
	constructor(configuration) {
		// 'configuration' - holds the configuration
		peerC = new RTCPeerConnection(configuration);
	};
	createAnswer(offerSDP, video, audio) {
		// 'offerSDP' - holds the value of the offerer SDP
		// 'video' and 'audio' - holds the value requried for creating the answerer's stream
		// 'twice' - is used to store boolean which is used to check if the localDescription is set 
		var twice = false;
		//calling function
		Connectsdp(offerSDP, video, audio);
		async function Connectsdp(offerSDP, video, audio) {
			//setting the inputted values for video and audio
			const constraints = { audio: video, video: audio };
			//'trackpassed' - is used to check if the media streams are added to the connection
			var trackpassed = false;
			//the bellow setInterval will keep repeating and create unnessary answerSDPs
			//thus we create 'repeateonce' to stop repetition
			var repeateonce = false;
			//getting the user's 
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			//setting val for 'Stream' as the local media stream
			Stream = stream;
			//setting the obtained media stream to the connection 
			for (const track of stream.getTracks()) {
				peerC.addTrack(track, stream);
				//changing the val of 'trackpassed' to true
				trackpassed = true;
			}
			setInterval(async () => {
				//checking if the remoteDescription has already been set or not
				//and if the media stream has been set to the connection
				if (trackpassed == true && repeateonce == false) {
					//changing the val to true to stop repetition
					repeateonce = true;
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
						//changing the val to true 
						twice = true;
					});
				}
			}, 10);
		}
		//creating a promise
		return new Promise((resolve, reject) => {
			// 'i' will keep check the time countdown
			var i = 0;
			// because we are using the setInterval to stop repeting resolve(from the created promise) 
			var dontRepeat = false;
			setInterval(() => {
				//1) checking if repeated or not.
				//2) checking if the answer is created twice or not
				//3) checking if the localDescription is set or not
				if (dontRepeat == false && twice == true && peerC.localDescription != null) {
					//returning the localDescription and the local stream
					resolve({ answer: JSON.stringify(peerC.localDescription), stream: Stream });
					//changing val to stop repetition
					dontRepeat = true;
					//increasing the val for timed out
					i++;
				}
				//the above fails or is taking too long so we:
				if (i == 5000) {
					reject("Timed Out: This device took long time to respond");
				}
			}, 5);
		})
	}
	async createOffer(video, audio) {
		// 'video' and 'audio' - holds the value requried for creating the offerer's stream
		//calling function
		await createOffer(video, audio);
		async function createOffer(video, audio) {
			//setting the inputted values for video and audio
			const constraints = { audio: audio, video: video };
			//calling the start function
			(async function () {
				await start()
			}());
			async function start() {
				//getting the user's requested media stream
				const stream = await navigator.mediaDevices.getUserMedia(constraints);
				//setting val for 'Stream' as the local media stream
				Stream = stream
				//setting the obtained media stream to the connection 
				for (const track of stream.getTracks()) {
					await peerC.addTrack(track, stream);
				}
			}
			//waiting for the stream to be added to the connection
			await (peerC.onnegotiationneeded = async () => {
				try {
					//trying to create an offer and set it as localDescription
					await peerC.setLocalDescription();
				} catch (err) {
					//when the localDescription - setting - fails, we send an error
					console.error("ERROR FOUND WHEN TRYING TO SET LOCAL DESCRIPTION AFTER STREAM INITALIZATION. ERROR:" + err);
				}
			});
		}
		return new Promise((resolve, reject) => {
			// 'i' will keep check the time countdown
			var i = 0;
			// because we are using the setInterval to stop repeting resolve(from the created promise) 
			var dontRepeat = false;
			setInterval(() => {
				//1) checking if repeated or not.
				//2) checking if the localDescription is set or not
				if (dontRepeat == false && peerC.localDescription != null) {
					//returning the localDescription and the local stream
					resolve({ offer: JSON.stringify(peerC.localDescription), stream: Stream });
					//changing val to stop repetition
					dontRepeat = true;
					//increasing the val for timed out
					i++;
				}
				//the above fails or is taking too long so we:
				if (i == 5000) {
					reject("Timed Out: This device took long time to respond");
				}
			}, 5);
		})
	}
	connectToAnswer(answerSDP) {
		//we set the remoteDescrtiption
		peerC.setRemoteDescription(JSON.parse(answerSDP)).then(() => {
			return new Promise((resolve, reject) => {
				//waiting for some time to check if the connection is a sucess or failure
				setTimeout(() => {
					//getting the state of the conection
					var state = peerC.connectionState;
					//if the state is connected we:
					if (state == "connected") {
						resolve("Congrats!!! WebRTC Conneciton is established Sucessfully");
					}//or else we:
					else {
						reject("Connection Is Not Sucessfull. Please Check GitHub For More Help. Or create a new Issue");
					}
				}, 1000);
			})
		})
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