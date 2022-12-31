"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
class ErrorBoundary extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorInfo: null,
            hasError: false,
        };
    }
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        this.setState({
            error: error,
            errorInfo: errorInfo,
            hasError: true,
        });
        console.error(this.state.error, this.state.errorInfo);
    }
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (0, jsx_runtime_1.jsx)("h1", { children: "Something went wrong." });
        }
        return this.props.children;
    }
}
exports.ErrorBoundary = ErrorBoundary;
