import "./App.css";
import React from "react";
import { getStreams } from "./functions/rtc";
import { createCall, answerCall } from "./functions/firebase";

function AppComponent() {
	const [streams, setStreams] = React.useState({
		localStream: null,
		remoteStream: null,
	});
	const [callIpVal, setCallIpVal] = React.useState("");
	const [webcamButtonEnable, setWebcamButtonEnable] = React.useState(true);
	const [callButtonEnable, setCallButtonEnable] = React.useState(false);
	const [answerButtonEnable, setAnswerButtonEnable] = React.useState(false);
	const [hangupButtonEnable, setHangupButtonEnable] = React.useState(false);

	const handleStartWebCam = async () => {
		await getStreams().then((streams) => {
			setStreams(streams);

			setCallButtonEnable(true);
			setAnswerButtonEnable(true);
			setWebcamButtonEnable(false);
		});
	};

	const handleCreateCall = async () => {
		const { callInputValue } = await createCall();
		setCallIpVal(callInputValue);
		setHangupButtonEnable(true);
	};

	const handleAnswerCall = async () => {
		await answerCall(callIpVal);
	};

	return (
		<div className="App">
			<h2>1. Start your Webcam</h2>
			<div className="videos">
				<span>
					<h3>Local Stream</h3>
					<video
						id="webcamVideo"
						srcobject={streams.localStream}
						autoPlay
						playsInline
					></video>
				</span>
				<span>
					<h3>Remote Stream</h3>
					<video
						id="remoteVideo"
						srcobject={streams.remoteStream}
						autoPlay
						playsInline
					></video>
				</span>
			</div>

			<button
				id="webcamButton"
				onClick={handleStartWebCam}
				disabled={!webcamButtonEnable}
			>
				Start webcam
			</button>
			<h2>2. Create a new Call</h2>
			<button
				id="callButton"
				onClick={handleCreateCall}
				disabled={!callButtonEnable}
			>
				Create Call (offer)
			</button>

			<h2>3. Join a Call</h2>
			<p>Answer the call from a different browser window or device</p>

			<input id="callInput" value={callIpVal} readOnly />
			<button
				id="answerButton"
				onClick={handleAnswerCall}
				disabled={!answerButtonEnable}
			>
				Answer
			</button>

			<h2>4. Hangup</h2>

			<button id="hangupButton" disabled={!hangupButtonEnable}>
				Hangup
			</button>

			<script type="module" src="/main.js"></script>
		</div>
	);
}

export default AppComponent;
