"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const axios_1 = require("axios");
const react_1 = require("react");
// import  {DraggableNumber} from './libs/draggable-number'
require("./Settings.css");
const react_dom_1 = require("react-dom");
function SaveExport(props) {
    const nameRef = (0, react_1.useRef)(null);
    const [selectedTrack, setSelectedTrack] = (0, react_1.useState)('');
    const [trackNames, setTrackNames] = (0, react_1.useState)([]);
    const [overwritePopup, setOverwritePopup] = (0, react_1.useState)();
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
    (0, react_1.useEffect)(() => {
        if (nameRef.current) {
            nameRef.current.addEventListener('focusin', () => {
                props.setFocus(true);
            });
            nameRef.current.addEventListener('focusout', () => {
                props.setFocus(false);
            });
            return (() => {
                nameRef.current.removeEventListener('focusin', props.setFocus(true));
                nameRef.current.removeEventListener('focusout', props.setFocus(false));
            });
        }
    }, []);
    (0, react_1.useEffect)(() => {
        var midiNoteTemp = [];
        if (props.midiNoteInfo.length > 0) {
            // props.midiNoteInfo.map((midiNote) => {
            //   midiNoteTemp.push(JSON.stringify(midiNote))
            // })
            // console.log(props.midiNoteInfo)
        }
    }, [props.midiNoteInfo]);
    async function changeSelected() {
        if (!trackNames.includes(selectedTrack))
            return;
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
            Object.entries(res.data).forEach((midiNote) => {
                midiNoteInfo.push(midiNote[1]);
            });
            props.setMidiNoteInfo(midiNoteInfo);
        });
    }
    function submit(trackname, callback) {
        console.log(trackNames.includes(trackname) && props.selectorsRef.current);
        if (trackNames.includes(trackname) && props.selectorsRef.current) {
            var over = 0;
            pickOverwrite();
            function pickOverwrite() {
                if (over === 0 && props.selectorsRef.current) {
                    setOverwritePopup((0, react_dom_1.createPortal)((0, jsx_runtime_1.jsxs)("div", { id: 'overwrite-modal', style: {
                            top: `${props.selectorsRef.current.offsetHeight}px`,
                            left: `${props.selectorsRef.current.offsetWidth / 2}px`,
                        }, children: [(0, jsx_runtime_1.jsxs)("button", { className: 'overwrite-button', onClick: () => { over = 1; setOverwritePopup(null); }, children: ["Overwrite ", trackname, "?"] }), (0, jsx_runtime_1.jsxs)("button", { className: 'overwrite-button', onClick: () => { over = 2; setOverwritePopup(null); }, children: ["Don't overwrite ", trackname] })] }), document.body));
                    setTimeout(pickOverwrite, 0);
                }
                else {
                    console.log('callback');
                    if (over === 1) {
                        callback();
                    }
                    else if (over === 2) {
                        return;
                    }
                }
            }
        }
        else {
            callback();
            setTrackNames((trackNames) => [trackname, ...trackNames]);
        }
    }
    async function overwrite(trackname) {
        const url = `${process.env.REACT_APP_API}/save-track`;
        const options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Origin-Allow': true,
            },
            username: props.username,
            trackname: trackname,
            midiNoteInfo: JSON.stringify({ ...props.midiNoteInfo }),
        };
        const track = await axios_1.default.post(url, options)
            .then((res) => {
            alert('savve');
        }).catch((err) => console.error(err));
        console.log(track);
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [overwritePopup, (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                    if (props.midiNoteInfoLength > 0)
                        alert();
                    props.setMidiNoteInfo([]);
                }, children: "New" }), (0, jsx_runtime_1.jsxs)("form", { id: 'save-track-form', className: 'save-export', method: 'post', onSubmit: (e) => {
                    e.preventDefault();
                    const target = e.target;
                    const trackname = target.trackname.value;
                    submit(trackname, () => {
                        overwrite(trackname);
                    });
                }, children: [(0, jsx_runtime_1.jsx)("input", { ref: nameRef, type: 'trackname', name: 'trackname', list: 'track-names', onChange: (e) => { props.setTrackName(e.target.value); setSelectedTrack(e.target.value); } }), (0, jsx_runtime_1.jsx)("datalist", { id: "track-names", children: trackNames.map((track) => {
                            return (0, jsx_runtime_1.jsx)("option", { children: track }, track);
                        }) }), (0, jsx_runtime_1.jsx)("button", { type: 'button', id: 'load', onClick: () => changeSelected(), children: "Load" }), (0, jsx_runtime_1.jsx)("input", { type: 'submit', value: 'Save' }), (0, jsx_runtime_1.jsx)("button", { onClick: () => props.controlsDispatch({ type: 'export', export: true }), children: "Export" })] })] }));
}
exports.default = SaveExport;
