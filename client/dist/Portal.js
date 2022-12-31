"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_dom_1 = require("react-dom");
function Portal({ rootId, children }) {
    const target = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        let container = document.getElementById(rootId);
        if (!container) {
            container = document.createElement("div");
            container.setAttribute("id", rootId);
            document.body.appendChild(container);
        }
        container.appendChild(target.current);
        return () => {
            target.current.remove();
            if (container.childNodes.length === 0) {
                container.remove();
            }
        };
    }, [rootId]);
    if (!target.current) {
        target.current = document.createElement("div");
    }
    return (0, react_dom_1.createPortal)(children, target.current);
}
;
exports.default = Portal;
