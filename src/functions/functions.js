const servers = {
	iceServers: [
		{
			urls: [
				"stun:stun1.l.google.com:19302",
				"stun:stun2.l.google.com:19302",
			],
		},
	],
	iceCandidatePoolSize: 10,
};

export const pc = new RTCPeerConnection(servers);

export const initializeMedia = () => {
	if (!("mediaDevices" in navigator)) {
		navigator.mediaDevices = {};
	}

	if (!("getUserMedia" in navigator.mediaDevices)) {
		navigator.mediaDevices.getUserMedia = (constraints) => {
			var getUserMedia =
				navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

			if (!getUserMedia) {
				return Promise.reject(
					new Error("getUserMedia is not implemented")
				);
			}

			return new Promise((resolve, reject) => {
				getUserMedia.call(navigator, constraints, resolve, reject);
			});
		};
	}
};

// const startWebCam = async (pc) => {
// 	initializeMedia();

// 	let localStream = await navigator.mediaDevices.getUserMedia({
// 		video: true,
// 		audio: true,
// 	});

// 	let remoteStream = new MediaStream();

// 	localStream.getTracks().forEach((track) => {
// 		pc.addTrack(track, localStream);
// 	});

// 	pc.ontrack = (event) => {
// 		event.streams[0].getTracks().forEach((track) => {
// 			remoteStream.addTrack(track);
// 		});
// 	};

// 	return { localStream, remoteStream };
// };
