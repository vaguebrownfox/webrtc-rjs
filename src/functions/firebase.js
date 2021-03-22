import firebase from "firebase/app";
import "firebase/firestore";
import { pc } from "./rtc";

const firebaseConfig = {
	apiKey: "AIzaSyB7Jjrs01D2M0jvhljEOvs-HD8MPJhx6vc",
	authDomain: "webrtc-test3.firebaseapp.com",
	projectId: "webrtc-test3",
	storageBucket: "webrtc-test3.appspot.com",
	messagingSenderId: "902786558932",
	appId: "1:902786558932:web:434db46b078fdb3043c441",
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();

export { firestore };

export const createCall = async () => {
	const callDoc = firestore.collection("calls").doc();
	const offerCandidates = callDoc.collection("offerCandidates");
	const answerCandidates = callDoc.collection("answerCandidates");

	const callInputValue = callDoc.id;

	pc.onicecandidate = (event) => {
		event.candidate && offerCandidates.add(event.candidate.toJSON());
	};

	// Create offer
	const offerDescription = await pc.createOffer();
	await pc.setLocalDescription(offerDescription);

	const offer = {
		sdp: offerDescription.sdp,
		type: offerDescription.type,
	};

	await callDoc.set({ offer });

	// Listen for remote answer
	callDoc.onSnapshot((snapshot) => {
		const data = snapshot.data();
		if (!pc.currentRemoteDescription && data?.answer) {
			const answerDescription = new RTCSessionDescription(data.answer);
			pc.setRemoteDescription(answerDescription);
		}
	});

	// When answered, add candidate to peer connection
	answerCandidates.onSnapshot((snapshot) => {
		snapshot.docChanges().forEach((change) => {
			if (change.type === "added") {
				const candidate = new RTCIceCandidate(change.doc.data());
				pc.addIceCandidate(candidate);
			}
		});
	});

	return { callInputValue };
};

export const answerCall = async (callInputValue) => {
	const callId = callInputValue;
	const callDoc = firestore.collection("calls").doc(callId);
	const answerCandidates = callDoc.collection("answerCandidates");
	const offerCandidates = callDoc.collection("offerCandidates");

	pc.onicecandidate = (event) => {
		event.candidate && answerCandidates.add(event.candidate.toJSON());
	};

	const callData = (await callDoc.get()).data();

	const offerDescription = callData.offer;
	await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

	const answerDescription = await pc.createAnswer();
	await pc.setLocalDescription(answerDescription);

	const answer = {
		type: answerDescription.type,
		sdp: answerDescription.sdp,
	};

	await callDoc.update({ answer });

	offerCandidates.onSnapshot((snapshot) => {
		snapshot.docChanges().forEach((change) => {
			console.log(change);
			if (change.type === "added") {
				let data = change.doc.data();
				pc.addIceCandidate(new RTCIceCandidate(data));
			}
		});
	});
};
