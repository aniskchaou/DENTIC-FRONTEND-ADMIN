import React from 'react';

class MinimalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // Optionally log error
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ color: '#1976d2', padding: 24, textAlign: 'center' }}>Something went wrong.</div>;
    }
    return this.props.children;
  }
}

export default MinimalErrorBoundary;