import ReactDOM from 'react-dom';
import React, { useEffect, useState, useMemo, useCallback, memo, useRef } from 'react';
import { RichUtils, Modifier, EditorState, getVisibleSelectionRect } from 'draft-js';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { usePopper } from 'react-popper';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { clearInlineStyles, createBlockEntity, takeSelectionFocus } from '@/utils/draftUtils';
import Icon from '@/components/Icon';
import styles from './InlineToolbar.less';

const cx = classNames.bind(styles);

const defaultBars = [
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'link',
  'formatclear',
  'delete',
];

// Native Toolbar
const ToolbarNative = (props) => {
  const {
    virtualElement,
    editorState,
    onChange,
    boxModeChange,
    bars = defaultBars,
    popoverClassName,
    getUpdateFn,
  } = props;

  // state
  const [boxMode, setBoxMode] = useState('normal');
  const [url, setUrl] = useState('');
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);

  // usePopper
  const {
    styles: innerStyles,
    attributes,
    update,
  } = usePopper(virtualElement, popperElement, {
    placement: 'top',
    modifiers: [
      {
        name: 'arrow',
        options: { element: arrowElement },
      },
      {
        name: 'offset',
        options: { offset: [0, 10] },
      },
      {
        name: 'flip',
        enabled: true,
      },
      {
        name: 'preventOverflow',
        options: { padding: 5 },
      },
      {
        name: 'computeStyles',
        options: { adaptive: false },
      },
    ],
  });

  // handler
  const handleBackToNormal = () => {
    setBoxMode('normal');
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleApplyLink = (e) => {
    const res = createBlockEntity(editorState, 'LINK', 'MUTABLE', { url });
    const newEditorState = RichUtils.toggleLink(
      res.editorState,
      res.editorState.getSelection(),
      res.entityKey,
    );
    e.editorState = newEditorState;
    setBoxMode('normal');
  };

  const handleDelegationClick = (e) => {
    // Keep editor focus to keep inlineToolbar visible
    const newEditorState = takeSelectionFocus(e.editorState || editorState);
    if (onChange) onChange(newEditorState);
  };

  const stopImmediatePropagation = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  // effect
  useEffect(() => {
    if (getUpdateFn) getUpdateFn(update);
  }, [getUpdateFn, update]);

  useEffect(() => {
    if (boxModeChange) boxModeChange(boxMode);
  }, [boxModeChange, boxMode]);

  // memorized
  const urlPass = useMemo(() => /^((https|http)?:\/\/)[^\s]+/.test(url), [url]);

  const hasLink = useMemo(() => RichUtils.currentBlockContainsLink(editorState), [editorState]);

  const defaultToolbars = useMemo(
    () => [
      {
        name: 'BOLD',
        tooltip: '加粗：Ctrl+B',
        component: <Icon name="bold" />,
        onClick(e) {
          const newEditorState = RichUtils.toggleInlineStyle(editorState, 'BOLD');
          e.editorState = newEditorState;
        },
      },
      {
        name: 'ITALIC',
        tooltip: '斜体：Ctrl+I',
        component: <Icon name="italic" />,
        onClick(e) {
          const newEditorState = RichUtils.toggleInlineStyle(editorState, 'ITALIC');
          e.editorState = newEditorState;
        },
      },
      {
        name: 'UNDERLINE',
        tooltip: '下划线：Ctrl+U',
        component: <Icon name="underline" />,
        onClick(e) {
          const newEditorState = RichUtils.toggleInlineStyle(editorState, 'UNDERLINE');
          e.editorState = newEditorState;
        },
      },
      {
        name: 'STRIKETHROUGH',
        tooltip: '删除线：Ctrl+Alt+S',
        component: <Icon name="strikethrough" />,
        onClick(e) {
          const newEditorState = RichUtils.toggleInlineStyle(editorState, 'STRIKETHROUGH');
          e.editorState = newEditorState;
        },
      },
      !hasLink && {
        name: 'LINK',
        tooltip: '超链接',
        component: <Icon name="link" />,
        onClick() {
          setBoxMode('link');
        },
      },
      hasLink && {
        name: 'LINK',
        tooltip: '取消超链接',
        component: <Icon name="unlink" />,
        onClick(e) {
          const selection = editorState.getSelection();
          const newEditorState = RichUtils.toggleLink(editorState, selection, null);
          e.editorState = newEditorState;
        },
      },
      {
        name: 'FORMATCLEAR',
        tooltip: '清除格式：Ctrl+Alt+L',
        component: <Icon name="format-clear" />,
        onClick(e) {
          const newEditorState = clearInlineStyles(editorState);
          e.editorState = newEditorState;
        },
      },
      {
        name: 'DELETE',
        tooltip: '移除：Ctrl+D',
        component: <Icon name="backspace" />,
        onClick(e) {
          e.stopPropagation(); // to disappear
          const contentState = editorState.getCurrentContent();
          const selectionState = editorState.getSelection();
          const newContentState = Modifier.removeRange(contentState, selectionState, 'forward');
          let newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
          newEditorState = takeSelectionFocus(newEditorState);
          if (onChange) onChange(newEditorState);
        },
      },
    ].filter(Boolean),
    [editorState, hasLink, onChange],
  );

  const computedToolbars = useCallback(
    (_bars) => {
      if (Array.isArray(_bars)) {
        return _bars
          .map((v) => defaultToolbars.find((item) => item.name.toLowerCase() === v))
          .filter(Boolean);
      }
      return [];
    },
    [defaultToolbars],
  );

  const toolbars = useMemo(() => computedToolbars(bars), [bars, computedToolbars]);

  const currentInlineStyle = useMemo(() => editorState.getCurrentInlineStyle(), [editorState]);

  return ReactDOM.createPortal(
    <SwitchTransition mode="out-in">
      <CSSTransition classNames="ArchEditor-fade" key={boxMode} timeout={300}>
        <div
          ref={setPopperElement}
          className={cx('popover', { [popoverClassName]: !!popoverClassName })}
          style={innerStyles.popper}
          role="dialog"
          onClick={stopImmediatePropagation}
          {...attributes.popper}
        >
          {boxMode === 'normal' && (
            <ul className={styles.content} onClick={handleDelegationClick}>
              {toolbars.map((item) => (
                <li
                  key={item.name}
                  title={item.tooltip}
                  onClick={item.onClick}
                  className={cx({ active: currentInlineStyle.has(item.name) })}
                >
                  {item.component}
                </li>
              ))}
            </ul>
          )}
          {boxMode === 'link' && (
            <div
              className={styles.linkContent}
              role="textbox"
              tabIndex="0"
              onClick={handleDelegationClick}
            >
              <button
                type="button"
                className={styles.button}
                onClick={handleBackToNormal}
                title="返回"
              >
                <Icon name="arrow-backward" />
              </button>
              <input
                type="text"
                className={styles.urlInput}
                placeholder="http(s)://"
                value={url}
                onClick={stopImmediatePropagation}
                onChange={handleUrlChange}
              />
              {urlPass && (
                <button
                  type="button"
                  className={styles.button}
                  onClick={handleApplyLink}
                  title="确定"
                >
                  <Icon name="done" />
                </button>
              )}
            </div>
          )}
          <div ref={setArrowElement} className={styles.popoverArrow} style={innerStyles.arrow} />
        </div>
      </CSSTransition>
    </SwitchTransition>,
    document.body,
  );
};

ToolbarNative.propTypes = {
  virtualElement: PropTypes.object,
  editorState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  boxModeChange: PropTypes.func,
  bars: PropTypes.arrayOf(PropTypes.string),
  popoverClassName: PropTypes.string,
  getUpdateFn: PropTypes.func,
};

// Inline Toolbar
const InlineToolbar = memo((props) => {
  const { visible, onRequestClose, ...rest } = props;

  const tempRect = useRef(null);

  // virtualElement
  const virtualElement = useMemo(
    () => ({ getBoundingClientRect: () => getVisibleSelectionRect(window) || tempRect.current }),
    [],
  );

  useEffect(() => {
    // Keep virtualElement getBoundingClientRect() !== null
    const rect = getVisibleSelectionRect(window);
    if (rect) tempRect.current = rect;
  });

  const handleRequestClose = useCallback(() => {
    if (onRequestClose) onRequestClose();
  }, [onRequestClose]);

  useEffect(() => {
    document.body.addEventListener('click', handleRequestClose);
    return () => {
      document.body.removeEventListener('click', handleRequestClose);
    };
  }, [handleRequestClose]);

  return (
    <CSSTransition in={visible} timeout={250} unmountOnExit classNames="ArchEditor-fade">
      <ToolbarNative {...rest} virtualElement={virtualElement} />
    </CSSTransition>
  );
});

InlineToolbar.propTypes = {
  visible: PropTypes.bool,
  onRequestClose: PropTypes.func,
  editorState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  boxModeChange: PropTypes.func,
  bars: PropTypes.arrayOf(PropTypes.string),
  popoverClassName: PropTypes.string,
  getUpdateFn: PropTypes.func,
};

export default InlineToolbar;
