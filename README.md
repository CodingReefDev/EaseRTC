# Welcome to EaseRTC

An Opensource Library for WebRTC.

With EaseRTC you can use our easy APIs to shorten your long code. Our easy Documentation can make you understand how all things work.

# Try Before Use

You can try our example online. 
<a href="https://codingreefdev.github.io/EaseRTC/">Link To The Project</a>


# How To Install

You will need to install [Git Bash](https://git-scm.com/downloads)

Then, lets Clone the GitHub repository

```
git clone https://github.com/CodingReef/EaseRTC.git
```

Or you can just add the following code snippet in the head tag of your html file

```html
<script src="https://codingreef.github.io/EaseRTC/EaseRTC.js" ></script>
```

NOTE : If you clone the git repository you will have an pre-built example which you can run.



# Supported APIs

First let's make a instance of the library's class to use the APIs inside it.

```javascript
var easeRTC = new EaseRTC(configuration);
```

Here, replace `configuration` with your ICE-Servers. More on ICE-Servers [HERE](https://developer.mozilla.org/en-US/docs/Web/API/RTCConfiguration/iceServers)

then you can use the following supported APIs 

* easeRTC.createOffer(video, audio);
* easeRTC.createAnswer(offerSDP, video, audio);
* easeRTC.connectToAnswer(answerSDP);
* easeRTC.getTracks();
* easeRTC.changeTrack();
* easeRTC.getMedia(video, audio);



## easeRTC.createOffer(video, audio);

The `createOffer` API accepts 2 values, video and audio -  these parameter describes the media types requested. Either or both must be specified. This is used in the offer-er's side

This API returns the user's media stream and the offer SDP.

Here are some examples

```javascript
easeRTC.createOffer(true, true).then(data=>{
    //data is in the json format.
    //you have to write your server code to pass the following offer to the answerer
    console.log(data.offer);
    //this holds this user's video and audio
    console.log(data.stream);
    document.getElementById('local').srcObject = data.stream;
});
```

```javascript
easeRTC.createOffer({width: 1280, height: 720}, true).then(data=>{
    console.log(data.offer);
    console.log(data.stream);
    document.getElementById('local').srcObject = data.stream;
});
```

```javascript
easeRTC.createOffer({
    width: { min: 1024, ideal: 1280, max: 1920 },
    height: { min: 576, ideal: 720, max: 1080 }}, true).then(data=>{
    console.log(data.offer);
    console.log(data.stream);
    document.getElementById('local').srcObject = data.stream;
});
```

```javascript
easeRTC.createOffer({ facingMode: "user" }, true).then(data=>{
    console.log(data.offer);
    console.log(data.stream);
    document.getElementById('local').srcObject = data.stream;
});
```



## easeRTC.createAnswer(offerSDP, video, audio);

The `createAnswer` API accepts 3 values - offerSDP this is the configuration given by the createOffer API, video and audio (same as createOffer). This API is used in the answerer's side

This API returns the users media stream and the answer SDP.

Here is an example

```javascript
easeRTC.createAnswer(/*pass the var which holds the offerSDP*/,true, true).then(data=>{
    //data is in the json format.
    //you have to write your server code to pass the following offer to the answerer
    console.log(data.offer);
    //this holds this user's video and audio
    console.log(data.stream);
    document.getElementById('local').srcObject = data.stream;
});
```

The same kind of media configurations form createOffer API can be used for this API too.



## easeRTC.connectToAnswer(answerSDP);

The `connectToSDP` API accepts 1 value - the answer SDP created by the answerer. This API used in the offer-er's side

This API returns an status, weather the connection is successful or not

Here is an example

```javascript
easeRTC.createAnswer(/*pass the var which holds the offerSDP*/).then(status=>{
    console.log(status)
});
```



## easeRTC.getTracks();

Okay, so now both the users are sharing their video and audio but they don't display them. To do so we use the `getTracks` API. This API gets the other user's audio and video.

This API returns an media stream object

Here's an example

```javascript
easeRTC.getTrack().then(stream=>{
    console.log(stream);
    document.getElementById('remote').srcObject=stream;
});
```



## easeRTC.changeTrack();

What if the user wants to turn off the video or audio. For this we use the `changeTracks` API.

***NOTE: THIS JUST CHANGES THE TRACKS, BUT TO TAKE EFFECT YOU HAVE TO REINITIATE THE FULL OFFERING AND ANSWERING PART***

This API returns an media stream object

Here's an example

```javascript
easeRTC.changeTrack(true, false).then(stream=>{
    console.log(stream);
    document.getElementById('local').srcObject=stream;
});
```

You can change the true and false value with different configurations as you wish.



## easeRTC.getMedia(video, audio);

This is not required for creating the `video call`  but can be used some where else if required. 

Here's an example

```javascript
easeRTC.getMedia(true, false).then(stream=>{
    console.log(stream);
    //you can use this as you wish
});
```

You can change the true and false value with different configurations as you wish.

# VERSION 2.0 UPDATE


## FEATURES 

* Reconnect Option.


## Supported Function


## easeRTC.setUpReconnect()

This function is to be called in the `answer peer's side` after first connection is being connected and before calling the `easeRTC.reconnect()` on the `offer peer's side.` This function helps you to setup reconnect on the side of answer peer. This is `IMPORTANT` to be called for the reconnection to work. This function only needs to be called once over a connection.

Example

```javascript
easeRTC.setUpReconnect();
```



## easeRTC.reconnect()

As mentioned above this can `only` be called in the offer peer's side. This reconnects the full session.

Example

```javascript
easeRTC.reconnect();
```


`PLEASE NOTE TO CALL THE easeRTC.getTracks() BEFORE RECONNECTION (EVERY TIME) TO GET THE REMOTE USER'S AUDIO AND VIDEO STREAMS.`



# What next?

Now that you know what to do, you can develop your own WebRTC Calling App/Website. If you come across any issue or problems you can start a new issue on GitHub, we will respond to you with the solution. And don't forget to check out our example files (run index.html).



# Want to contribute?

As this is an open source Project you can add your advancement to this and contribute it, we'll see if it works and publish it. Make sure to add your name in the `Contributors List.md` file before you contribute it. thanks!!!



Thank you for using easeRTC

CodingReef Developers Team

<hr>
<a href="https://easertc.codingreef.com">  Official Site  </a> <a href="https://dev.codingreef.com">  Coding Reef Developers  </a> <a href="https://www.youtube.com/channel/UCp_f4cyDXi09pvf-bdMm7iw">  YouTube  </a> <a href='https://github.com/CodingReefDev' >  GitHub  </a>
