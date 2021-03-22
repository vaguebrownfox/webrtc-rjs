import { initializeMedia } from "./functions";

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
let localStream = null;
let remoteStream = null;

export const getStreams = async () => {
	initializeMedia();

	localStream = await navigator.mediaDevices.getUserMedia({
		video: true,
		audio: true,
	});

	remoteStream = new MediaStream();

	// Push tracks from local stream to peer connection
	localStream.getTracks().forEach((track) => {
		pc.addTrack(track, localStream);
	});

	// Pull tracks from remote stream, add to video stream
	pc.ontrack = (event) => {
		event.streams[0].getTracks().forEach((track) => {
			remoteStream.addTrack(track);
		});
	};

	return { localStream, remoteStream };
};
