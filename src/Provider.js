import React from 'react';
import PropTypes from 'prop-types';
import { defaultEditorState } from '@/utils/default';

// 利用Provider来内部维护多组件之间共享的editorState
export const ArchEditorContext = React.createContext({});

export class ArchEditorProvider extends React.Component {
  constructor(props) {
    super(props);
    this.setEditorState = this._setEditorState.bind(this);
    this.state = {
      editorContext: {
        contextEditorState: defaultEditorState,
        setContextEditorState: this.setEditorState,
      },
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { value } = props;
    if (value) {
      return {
        editorContext: {
          ...state.editorContext,
          contextEditorState: value,
        },
      };
    }
    return null;
  }

  _setEditorState(v) {
    const { editorContext } = this.state;
    const { value, onChange } = this.props;
    if (!value) {
      this.setState({
        editorContext: {
          ...editorContext,
          contextEditorState: v,
        },
      });
    }
    if (onChange) onChange(v);
  }

  render() {
    const { children } = this.props;
    const { editorContext } = this.state;
    return <ArchEditorContext.Provider value={editorContext}>{children}</ArchEditorContext.Provider>;
  }
}

ArchEditorProvider.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  children: PropTypes.any,
};
