"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const usePortal = (el) => {
    const [portal, setPortal] = (0, react_1.useState)([{}, {
            render: () => null,
            remove: () => null,
        }]);
    const createPortal = (0, react_1.useCallback)((el) => {
        //render a portal at the given DOM node:
        const Portal = ({ children }) => react_dom_1.default.createPortal(children, el);
        //delete the portal from memory:
        const remove = () => react_dom_1.default.unmountComponentAtNode(el);
        return { render: Portal, remove };
    }, []);
    (0, react_1.useEffect)(() => {
        //if there is an existing portal, remove the new instance.
        //is prevents memory leaks
        if (el)
            portal[1].remove();
        //otherwise, create a new portal and render it
        const newPortal = createPortal(el);
        setPortal(portal => portal[0] = { [noteTrackId]: newPortal.render() });
        //when the user exits the page, delete the portal from memory.
        return () => newPortal[1].remove(el);
    }, [el]);
    return portal[0].render;
};
exports.default = usePortal;
