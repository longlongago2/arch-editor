// NOTE:
// 1️⃣.想要独立打包js至lib需要使用@绝对路径，否则将直接打包，不会打包成独立js。
// 2️⃣.v17之后，develop 不用导入React： https://zh-hans.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html，但打包lib commonjs模式，必须导入React，否则使用时将报错。
// 3️⃣.静态资源 src/static 将单独拷贝，新的 static 资源如果需要引用并打包，需手动加入到 webpack.config.build.js -> webpackConfigBuildLib -> externals

import '@/static/iconfont'; // Symbol svg icon
import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';
import { Editor, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import classNames from 'classnames/bind';
import { validateSelection, forceReRender } from '@/utils/draftUtils';
import {
  defaultKeyBindingFn,
  defaultCustomStyleMap,
  getDefaultKeyCommandState,
  defaultEditorState,
} from '@/utils/default';
import { ArchEditorProvider, ArchEditorContext } from '@/Provider';
import { atomic } from '@/utils/atomic';
import Icon from '@/components/Icon';
import InlineToolbar from '@/InlineToolbar';
import ErrorBoundary from '@/components/ErrorBoundary';
import BlockToolbar from '@/BlockToolbar';
import AtomicTable from '@/components/AtomicTable';
import AtomicImage from '@/components/AtomicImage';
import AtomicFormula from '@/components/AtomicFormula';
import styles from './index.less';

const cx = classNames.bind(styles);

const Formula = atomic(AtomicFormula);
const Image = atomic(AtomicImage);
const Table = atomic(AtomicTable);

class ArchEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: defaultEditorState, // composite editorState
      innerEditorState: defaultEditorState,
      innerReadOnly: false, // readOnly for custom block components(atomic)
      showPopover: false, // show or hide inlineToolbar
      activeEntityKey: '',
    };
    this.editor = createRef(null);
    this.setActiveEntityKey = this._setActiveEntityKey.bind(this);
    this.computedEditorState = this._computedEditorState.bind(this);
    this.handleChange = this._handleChange.bind(this);
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.handleRequestClose = this._handleRequestClose.bind(this);
    this.selectionListener = this._selectionListener.bind(this);
    this.getEditorRaw = this._getEditorRaw.bind(this);
    this.getPlainText = this._getPlainText.bind(this);
    this.blockRendererFn = this._blockRendererFn.bind(this);
    this.focus = () => this.editor.current.focus();
    this.blur = () => this.editor.current.blur();
    this.getInlineToolbarUpdate = (update) => {
      this.updateInlineToolbar = update;
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { readOnly } = props;
    if (readOnly !== undefined) {
      return {
        ...state,
        innerReadOnly: readOnly,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    this.selectionListener();
    this.computedEditorState(prevState);
  }

  componentWillUnmount() {
    this.timerMountIT && clearTimeout(this.timerMountIT);
  }

  _computedEditorState(prevState) {
    // priority：prop editorState > context editorState > inner editorState
    const { editorState } = this.props;
    const { editorState: prevEditorState } = prevState;
    const { innerEditorState } = this.state;
    const { contextEditorState } = this.context;
    let compositeEditorState;
    if (editorState) {
      compositeEditorState = editorState; // prop editorState
    } else if (contextEditorState) {
      compositeEditorState = contextEditorState; // context editorState
    } else {
      compositeEditorState = innerEditorState; // inner editorState
    }
    // Immutable Record equals
    const prevRecord = prevEditorState._immutable;
    const record = compositeEditorState._immutable;
    if (prevRecord && prevRecord.equals && prevRecord.equals(record)) return;
    this.setState({ editorState: compositeEditorState });
  }

  _handleChange(_editorState) {
    const { editorState, onChange } = this.props;
    const { setContextEditorState } = this.context;
    // change editorState priority：prop editorState > context editorState > inner editorState
    if (editorState && onChange) {
      onChange(_editorState); // prop editorState
      return;
    }
    if (setContextEditorState) {
      setContextEditorState(_editorState); // context editorState
      return;
    }
    this.setState({ innerEditorState: _editorState }); // inner editorState
  }

  _handleRequestClose() {
    const { showPopover } = this.state;
    showPopover && this.setState({ showPopover: false });
  }

  _setActiveEntityKey(key, callback) {
    // 自定义组件处在编辑状态设置readOnly={true}, key存在可判定组件正在编辑
    // If your custom block renderer requires mouse interaction, it is often wise to temporarily set your Editor to readOnly={true} during this interaction.
    // https://draftjs.org/docs/advanced-topics-block-components#recommendations-and-other-notes
    const { editorState } = this.state;
    this.setState({ activeEntityKey: key, innerReadOnly: Boolean(key) }, callback);
    // force re-render to execute blockRendererFn
    // https://github.com/facebook/draft-js/issues/458
    const newEditorState = forceReRender(editorState);
    this.handleChange(newEditorState);
  }

  _getEditorRaw() {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    return convertToRaw(contentState);
  }

  _getPlainText(_editorState) {
    const { editorState = _editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    return contentState.getPlainText();
  }

  _selectionListener() {
    const { showInlineToolbar } = this.props;
    // Do not mount inlineToolbar
    if (!showInlineToolbar) return;

    const { editorState } = this.state;
    const selectionState = editorState.getSelection();
    const isCollapsed = selectionState.isCollapsed();
    const start = selectionState.getStartOffset();
    const end = selectionState.getEndOffset();
    const unchanged = this.prevPosS === start && this.prevPosE === end;

    // Record position
    this.prevPosS = start;
    this.prevPosE = end;

    if (unchanged) return;

    const validated = validateSelection(editorState); // avoid popuping inlineToolbar
    const shouldMount = !isCollapsed && validated; // conditions for mount

    // Mount inlineToolbar
    if (shouldMount) {
      this.timerMountIT = setTimeout(() => {
        this.updateInlineToolbar && this.updateInlineToolbar(); // update inlineToolbar postion
        this.setState({ showPopover: true });
      }, 150);
    }
  }

  _handleKeyCommand(command, editorState) {
    const newState = getDefaultKeyCommandState(command, editorState);
    if (newState) {
      this.handleChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  _blockRendererFn(block) {
    const { editorState, innerReadOnly, activeEntityKey } = this.state;
    const { atomicRendererFn, blockRendererFn, readOnly } = this.props;
    if (block.getType() === 'atomic') {
      const entityKey = block.getEntityAt(0);
      let type;
      let data;
      if (entityKey) {
        const contentState = editorState.getCurrentContent();
        const entity = contentState.getEntity(entityKey);
        type = entity.getType();
        data = entity.getData();
      }
      const atomicProps = {
        data,
        readOnly,
        editorState,
        setEditorState: this.handleChange,
        entityKey,
        activeEntityKey,
        setActiveEntityKey: this.setActiveEntityKey,
      };
      if (type === 'TABLE') {
        return {
          component: Table,
          editable: false,
          props: { ...atomicProps, Editor: ArchEditor },
        };
      }
      if (type === 'FORMULA') {
        return {
          component: Formula,
          editable: false,
          props: atomicProps,
        };
      }
      if (type === 'IMAGE') {
        return {
          component: Image,
          editable: !innerReadOnly,
          props: atomicProps,
        };
      }
      if (atomicRendererFn) {
        return atomicRendererFn({
          ...atomicProps,
          type,
        });
      }
      return null;
    }

    // Non-atomic blockRendererFn
    if (blockRendererFn) {
      return blockRendererFn(block);
    }
    return null;
  }

  render() {
    const {
      editorState, // Draft.js property
      onChange, // Draft.js property
      readOnly, // Draft.js property
      blockRendererFn, // Draft.js property
      className, // Non-Draft.js property
      showInlineToolbar, // Non-Draft.js property
      popoverClassName, // Non-Draft.js property
      inlineBars, // Non-Draft.js property
      ...restProps // All other Draft.js properties support rewriting
    } = this.props;

    const { innerReadOnly, editorState: compositeEditorState, showPopover } = this.state;

    return (
      <ErrorBoundary>
        <div className={cx('container', { [className]: !!className })}>
          {showInlineToolbar && (
            <InlineToolbar
              visible={showPopover}
              bars={inlineBars}
              editorState={compositeEditorState}
              onChange={this.handleChange}
              popoverClassName={popoverClassName}
              getUpdateFn={this.getInlineToolbarUpdate}
              onRequestClose={this.handleRequestClose}
            />
          )}
          <Editor
            ref={this.editor}
            readOnly={innerReadOnly}
            editorState={compositeEditorState}
            onChange={this.handleChange}
            customStyleMap={defaultCustomStyleMap}
            keyBindingFn={defaultKeyBindingFn}
            handleKeyCommand={this.handleKeyCommand}
            blockRendererFn={this.blockRendererFn}
            {...restProps}
          />
        </div>
      </ErrorBoundary>
    );
  }
}

ArchEditor.contextType = ArchEditorContext;

ArchEditor.defaultProps = { showInlineToolbar: true };

ArchEditor.propTypes = {
  editorState: PropTypes.any,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  readOnly: PropTypes.bool,
  blockRendererFn: PropTypes.func,
  className: PropTypes.string,
  popoverClassName: PropTypes.string, // 内嵌工具栏弹出框样式
  showInlineToolbar: PropTypes.bool, // 使用内嵌工具栏
  inlineBars: PropTypes.arrayOf(PropTypes.string),
  atomicRendererFn: PropTypes.func,
};

export * from 'draft-js';

export * from '@/utils/default';

export * from '@/utils/draftUtils';

export * from '@/utils/atomic';

export { ArchEditor, ArchEditorProvider, BlockToolbar, Icon };
