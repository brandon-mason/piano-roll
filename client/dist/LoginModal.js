"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_dom_1 = require("react-dom");
require("./LoginModal.css");
const axios_1 = require("axios");
function RegModal(props) {
    const formRef = (0, react_1.useRef)(null);
    const [warnings, setWarnings] = (0, react_1.useState)('');
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { id: 'reg-bg' }), (0, jsx_runtime_1.jsxs)("div", { id: 'loginreg-modal', children: [(0, jsx_runtime_1.jsx)("button", { className: 'loginreg-element close-button', onClick: () => { props.onClose(false); props.onRegister(false); }, children: "X" }), (0, jsx_runtime_1.jsxs)("form", { id: 'register-form', ref: formRef, method: 'post', onSubmit: async (e) => {
                            e.preventDefault();
                            const target = e.target;
                            const email = target.email.value; // typechecks!
                            const username = target.username.value;
                            const password = target.password.value; // typechecks!
                            // console.log(email, username, password)
                            const url = `${process.env.REACT_APP_API}/register`;
                            const options = {
                                method: 'POST',
                                mode: 'cors',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Origin-Allow': true
                                },
                                email: email,
                                username: username,
                                password: password,
                            };
                            // if(email.includes('@') && email.includes('.com') && email.length < 7) {
                            //   setWarnings('Invalid Email')
                            //   return;
                            // }
                            // if(username.length < 6) {
                            //   setWarnings((warnings) => warnings + '\nInvalid Username')
                            //   return;
                            // }
                            // if(password.length < 6 ) {
                            //   setWarnings((warnings) => warnings + '\nInvalid Password')
                            //   return;
                            // }
                            const credentials = await axios_1.default.post(url, options)
                                .then((res) => {
                                alert(res.data.message);
                                props.setShowRegister(false);
                            }).catch((err) => {
                                console.log(err.response.data.error);
                                setWarnings(err.response.data.error);
                            });
                            console.log(credentials);
                        }, children: [(0, jsx_runtime_1.jsx)("label", { className: 'credentials-label', children: "Email:" }), (0, jsx_runtime_1.jsx)("input", { type: 'email', name: 'email', id: 'email', className: 'loginreg-element', defaultValue: '' }), (0, jsx_runtime_1.jsx)("label", { className: 'credentials-label', children: "Username:" }), (0, jsx_runtime_1.jsx)("input", { type: 'username', name: 'username', id: 'reg-username', className: 'loginreg-element', defaultValue: '' }), (0, jsx_runtime_1.jsx)("label", { className: 'credentials-label', children: " Password:" }), (0, jsx_runtime_1.jsx)("input", { type: 'password', name: 'password', id: 'reg-password', className: 'loginreg-element', defaultValue: '' }), (0, jsx_runtime_1.jsx)("span", { className: 'warnings loginreg-text', style: { whiteSpace: 'pre-line' }, children: warnings }), (0, jsx_runtime_1.jsx)("input", { type: 'submit', id: 'register', className: 'loginreg-element button', value: 'Register' })] })] })] }));
}
function LoginModal(props) {
    const formRef = (0, react_1.useRef)(null);
    const [user, setUser] = (0, react_1.useState)('');
    const [warnings, setWarnings] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        console.log(user);
        if (user.length > 0) {
            props.setUser(user);
            setWarnings('');
        }
    }, [user]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { id: 'login-bg' }), (0, jsx_runtime_1.jsxs)("div", { id: 'loginreg-modal', children: [(0, jsx_runtime_1.jsx)("button", { className: 'loginreg-element close-button', onClick: () => props.onClose(false), children: "X" }), (0, jsx_runtime_1.jsxs)("form", { id: 'login-form', ref: formRef, method: 'post', onSubmit: async (e) => {
                            e.preventDefault();
                            const target = e.target;
                            const username = target.username.value;
                            const password = target.password.value; // typechecks!
                            const url = `${process.env.REACT_APP_API}/login`;
                            const options = {
                                method: 'POST',
                                mode: 'cors',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Origin-Allow': true
                                },
                                username: username,
                                password: password,
                            };
                            if (username.length < 5) {
                                setWarnings('Invalid username and/or password.');
                                return;
                            }
                            if (password.length < 7) {
                                setWarnings('Invalid username and/or password.');
                                return;
                            }
                            const credentials = await axios_1.default.post(url, options)
                                .then((res) => {
                                console.log(res.data);
                                alert(res.data.message);
                                setUser(username);
                            }).catch((err) => {
                                console.log(err);
                                console.log(err);
                                setWarnings(err.response.data.error);
                            });
                            console.log(credentials);
                        }, children: [(0, jsx_runtime_1.jsx)("label", { className: 'credentials-label', children: "Username:" }), (0, jsx_runtime_1.jsx)("input", { type: 'username', name: 'username', id: 'login-username', className: 'loginreg-element' }), (0, jsx_runtime_1.jsx)("label", { className: 'credentials-label', children: " Password:" }), (0, jsx_runtime_1.jsx)("input", { type: 'password', name: 'password', id: 'login-passsword', className: 'loginreg-element' }), (0, jsx_runtime_1.jsx)("span", { className: 'warnings loginreg-text', children: warnings }), (0, jsx_runtime_1.jsx)("input", { type: 'submit', id: 'login', className: 'loginreg-element button', value: 'Login' }), (0, jsx_runtime_1.jsx)("label", { className: 'register-label loginreg-text', children: " Don't have an account?" }), (0, jsx_runtime_1.jsx)("button", { id: 'register', className: 'loginreg-element button', onClick: () => props.onRegister(true), children: "Register" })] })] })] }));
}
function ShowLoginModal(props) {
    const [showLogin, setShowLogin] = (0, react_1.useState)(false);
    const [showRegister, setShowRegister] = (0, react_1.useState)(false);
    const [user, setUser] = (0, react_1.useState)('');
    const logreg = (0, react_1.useMemo)(() => {
        if (showLogin && !showRegister) {
            return (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)(LoginModal, { onClose: setShowLogin, onRegister: setShowRegister, setUser: loggedIn }), document.body);
        }
        else if (showRegister) {
            return (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)(RegModal, { onClose: setShowLogin, onRegister: setShowRegister, setShowRegister: setShowRegister }), document.body);
        }
        function loggedIn(user) {
            props.setUser(user);
            setUser(user);
            setShowLogin(false);
        }
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
    }, [showLogin, showRegister]);
    // const [elemToShow, setElemToShow] = useState<()
    (0, react_1.useEffect)(() => {
        // setElemToShow(
        //   <>
        //     <button onClick={() => setShowLogin(true)} >Login</button>
        //     {showLogin && createPortal(
        //       (showRegister) ? <LoginModal onClose={setShowLogin} onRegister={setShowRegister} /> : <RegModal onClose={setShowLogin} onRegister={setShowRegister} />,
        //       document.body
        //     )}
        //   </>
        // )
    }, [showRegister]);
    (0, react_1.useEffect)(() => {
        props.setFocus(showLogin);
    }, [showLogin]);
    // useEffect(() => {
    // }, [showLogin, showRegister])
    function setFocusLogin(focus) {
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(user.length === 0) ? (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowLogin(true), children: "Login" }) : (0, jsx_runtime_1.jsx)("button", { onClick: () => { setUser(''); props.setUser(''); }, children: "Logout" }), logreg] }));
}
exports.default = ShowLoginModal;
