"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const axios_1 = require("axios");
require("./Settings.css");
function SavedTracks(props) {
    const [trackNames, setTrackNames] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        async function getSavedTracks() {
            const url = `${process.env.REACT_APP_API}/get-saved-tracks/${props.username}`;
            const options = {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': true,
                },
            };
            var trackNames = [];
            const savedTracks = await axios_1.default.get(url, options)
                .then((res) => {
                trackNames = res.data;
                setTrackNames(trackNames);
                return res.data;
            }).catch((err) => console.error(err));
            return savedTracks;
        }
        if (props.username.length > 0)
            getSavedTracks();
        if (props.username.length === 0) {
            props.setMidiNoteInfo([]);
            setTrackNames([]);
        }
    }, [props.username]);
    async function changeSelected(selectedTrack) {
        const url = `${process.env.REACT_APP_API}/get-track/${props.username}/${selectedTrack}`;
        const options = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Origin-Allow': true
            },
        };
        var midiNoteInfo = [];
        const track = axios_1.default.get(url, options)
            .then((res) => {
            console.log(res.data);
            Object.entries(res.data).forEach((midiNote) => {
                midiNoteInfo.push(midiNote[1]);
            });
            props.setMidiNoteInfo(midiNoteInfo);
        });
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => {
                    if (props.midiNoteInfoLength > 0)
                        alert();
                    props.setMidiNoteInfo([]);
                }, children: "New" }), (0, jsx_runtime_1.jsx)("select", { id: 'track-names', className: 'save-export', onChange: (e) => changeSelected(e.target.value), children: trackNames.map((track) => {
                    return (0, jsx_runtime_1.jsx)("option", { children: track }, track);
                }) })] }));
}
exports.default = SavedTracks;
