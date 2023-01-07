import React, { logErrorToMyService } from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
<<<<<<< HEAD
    this.state = { 
      error: null,
      errorInfo: null,
      hasError: false,
    };
=======
    this.state = { hasError: false };
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
<<<<<<< HEAD
    this.setState({
      error: error,
      errorInfo: errorInfo,
      hasError: true,
    })
    console.error(this.state.error, this.state.errorInfo);
=======
    console.error(error, errorInfo);
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
