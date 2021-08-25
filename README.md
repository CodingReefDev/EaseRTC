# Welcome to EaseRTC

EaseRTC Opensource Library for WebRTC. It helps you code your program faster than using normal WebRTC API. 

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

> NOTE : If you clone the git repository you will have an pre-built example which you can run.



# Supported APIs

First let's make a instance of the library's class to use the functions inside it.

```javascript
var easeRTC = new EaseRTC(configuation, offerOptions, answerOptions);
```

Let's see what's going on,

`configuation` - [RTCPeerConnection Configuration](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection#rtcconfiguration_dictionary)

`offerOptions` - [RTCOfferOptions](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer#rtcofferoptions_dictionary)

`answerOptions` - [RTCAnswerOptions](https://developer.mozilla.org/en-US/docs/Web/API/RTCAnswerOptions)

Now that the Instance is created you can use functions inside this class

* easeRTC.createOffer();
* easeRTC.createAnswer(offer);
* easeRTC.acceptAnswer(answer);
* easeRTC.onIce();
* easeRTC.addIce(iceCandidate);
* easeRTC.ontrack();
* easeRTC.addTrack(track);
* easeRTC.reconnectSession();
* easeRTC.getRTCObject();
* easeRTC.getMedia();

# Documentation

For full details on this API please visit our official [EaseRTC website](https://easertc.codingreef.com)


# What next?

Now that you know what to do, you can develop your own WebRTC Calling App/Website. If you come across any issue or problems you can start a new issue on GitHub, we or the community will respond to you with the solution. And don't forget to check out our example files (run index.html).


# Want to contribute?

As this is an open source Project you can add your advancement to this and contribute it, we'll see if it works and publish it. Make sure to add your name in the `readme.md` file before you contribute it. thanks!!!

# contributors

[Vigneshkumar212](https://github.com/Vigneshkumar212)


Thank you for using easeRTC,

CodingReef Developers Team

<hr>
<a href="https://easertc.codingreef.com"> Official Site </a> <br>
<a href="https://dev.codingreef.com"> Coding Reef Developers </a> <br>
<a href='https://github.com/CodingReefDev' > GitHub </a>
