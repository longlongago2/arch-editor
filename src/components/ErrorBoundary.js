import React from 'react';
import PropTypes from 'prop-types';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const { onCatch } = this.props;
    if (typeof onCatch === 'function') onCatch(error, errorInfo);
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return (
        <section>
          <h1>:( </h1>
          <h3>ArchEditor broken down!</h3>
          <p>
            Please use the browser
            <button
              type="button"
              style={{
                marginLeft: 5,
                marginRight: 5,
                border: '1px solid #ccc',
                backgroundColor: '#f0f0f0',
                color: '#666',
              }}
            >
              F12
            </button>
            to troubleshoot the error.
          </p>
        </section>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.element,
  onCatch: PropTypes.func,
};
