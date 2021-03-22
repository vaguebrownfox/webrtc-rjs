import createDataContext from "../createDataContext";
import { getStreams } from "../functions/rtc";

// Initial State
const appInitialState = {
	loading: false,

	localStream: null,
	remoteStream: null,

	webcamButtonDisabled: false,
	callButtonDisabled: false,
	answerButtonDisabled: false,
};

// Reducer
const appReducer = (state, action) => {
	switch (action.type) {
		case "SET_LOADING":
			return { ...state, loading: action.payload };
		case "SET_STREAMS":
			return { ...state };

		default:
			return state;
	}
};

// Actions

const appAction = (dispatch) => {
	return () => {
		dispatch({ type: "LOADING", payload: true });

		console.log("app action log");

		dispatch({ type: "LOADING", payload: true });
	};
};

const appInit = (dispatch) => {
	return () => {
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

		// const pc = new RTCPeerConnection(servers);

		// dispatch({ type: "PC", payload: pc });
	};
};

const startWebCam = (dispatch) => {
	return async () => {
		let {localStream, remoteStream} = await ()

		dispatch({ type: "STREAMS", payload: { localStream, remoteStream } });
	};
};

// Export
export const { Context, Provider } = createDataContext(
	appReducer,
	{
		appAction,
		appInit,
		startWebCam,
	},
	appInitialState
);
