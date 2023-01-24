"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function UISettings(props) {
    const xGridSliderRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (xGridSliderRef.current)
            props.setXGridSize(parseInt(xGridSliderRef.current.value));
    }, [xGridSliderRef.current]);
    if (xGridSliderRef.current) {
        xGridSliderRef.current.oninput = () => {
            console.log(xGridSliderRef.current.value);
            props.setXGridSize(parseInt(xGridSliderRef.current.value));
        };
    }
    return ((0, jsx_runtime_1.jsx)("input", { type: 'range', ref: xGridSliderRef, min: '-50', max: '50', defaultValue: '0', className: 'slider', id: 'x-grid-size' }));
}
exports.default = UISettings;
