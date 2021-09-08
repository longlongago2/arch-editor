// *** Support Provider ***
import React, { useMemo, useCallback, Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { v4 as uuid } from 'uuid';
import { RichUtils, AtomicBlockUtils, convertToRaw, EditorState } from 'draft-js';
import { defaultEditorState } from '@/utils/default';
import { createBlockEntity, takeSelectionFocus } from '@/utils/draftUtils';
import { ArchEditorContext } from '@/Provider';
import Icon from '@/components/Icon';
import Tooltip from '@/components/Tooltip';
import CellSelector from '@/components/CellSelector';
import styles from './BlockToolbar.less';

const cx = classNames.bind(styles);

const defaultBars = [
  'unstyled',
  'h1',
  'h2',
  'h3',
  'divider',
  'ol',
  'ul',
  'divider',
  'image',
  'table',
  'formula',
];

const unStyle = {
  fontSize: 14,
  marginRight: 5,
};

const headerStyle = {
  display: 'inline-block',
  lineHeight: 1,
  margin: 0,
  padding: 5,
  color: '#fff',
};

const listStyle = {
  display: 'inline-block',
  lineHeight: 1.7,
  margin: 0,
  padding: 0,
  marginLeft: 20,
  marginRight: 10,
  fontSize: 14,
};

const BlockToolbar = (props) => {
  // props
  const {
    editorState: propEditorState,
    onChange: setPropEditorState,
    bars = defaultBars,
    extraBarMaps = [],
    showNumberOfWords,
  } = props;

  // context
  const { contextEditorState, setContextEditorState } = useContext(ArchEditorContext);

  // computed priority：prop editorState > context editorState > inner editorState
  const editorState = useMemo(
    () => propEditorState || contextEditorState || defaultEditorState,
    [contextEditorState, propEditorState],
  );

  const computedOnChange = useCallback(() => {
    if (propEditorState) return setPropEditorState;
    if (contextEditorState) return setContextEditorState;
    return null;
  }, [contextEditorState, propEditorState, setPropEditorState, setContextEditorState]);

  const onChange = useMemo(() => computedOnChange(), [computedOnChange]);

  // handler
  const handleCreateTable = useCallback(
    (pos) => {
      const [i, j] = pos;
      const defaultContentState = EditorState.createEmpty().getCurrentContent();
      const defaultRawContentState = convertToRaw(defaultContentState);
      const rows = new Array(i).fill().map(() => ({
        key: uuid(),
        columns: new Array(j).fill().map(() => ({
          key: uuid(),
          rawContentState: defaultRawContentState,
        })),
      }));
      const res = createBlockEntity(editorState, 'TABLE', 'MUTABLE', {
        initial: true,
        rows,
      });
      const newEditorState = AtomicBlockUtils.insertAtomicBlock(
        res.editorState,
        res.entityKey,
        ' ',
      );
      if (onChange) onChange(newEditorState);
    },
    [editorState, onChange],
  );

  // memorized
  const computedBars = useCallback((_bars) => {
    if (Array.isArray(_bars)) return _bars;
    if (typeof _bars === 'function') return _bars(defaultBars);
    return [];
  }, []);

  const innerBars = useMemo(() => computedBars(bars), [bars, computedBars]);

  const defaultBarMaps = useMemo(
    () => [
      {
        name: 'UNSTYLED',
        tooltip: (
          <>
            <span style={unStyle}>正文</span>
            <span>Ctrl+Alt+T</span>
          </>
        ),
        component: <Icon name="text" />,
        onClick() {
          const temp = RichUtils.toggleBlockType(editorState, 'unstyled');
          const newEditorState = takeSelectionFocus(temp);
          if (onChange) onChange(newEditorState);
        },
      },
      {
        name: 'H1',
        tooltip: (
          <>
            <h1 style={headerStyle}>H1</h1>
            <span>Ctrl+Alt+F1</span>
          </>
        ),
        component: <Icon name="h1" />,
        active: RichUtils.getCurrentBlockType(editorState) === 'header-one',
        onClick() {
          const temp = RichUtils.toggleBlockType(editorState, 'header-one');
          const newEditorState = takeSelectionFocus(temp);
          if (onChange) onChange(newEditorState);
        },
      },
      {
        name: 'H2',
        tooltip: (
          <>
            <h2 style={headerStyle}>H2</h2>
            <span>Ctrl+Alt+F2</span>
          </>
        ),
        component: <Icon name="h2" />,
        active: RichUtils.getCurrentBlockType(editorState) === 'header-two',
        onClick() {
          const temp = RichUtils.toggleBlockType(editorState, 'header-two');
          const newEditorState = takeSelectionFocus(temp);
          if (onChange) onChange(newEditorState);
        },
      },
      {
        name: 'H3',
        tooltip: (
          <>
            <h3 style={headerStyle}>H3</h3>
            <span>Ctrl+Alt+F3</span>
          </>
        ),
        component: <Icon name="h3" />,
        active: RichUtils.getCurrentBlockType(editorState) === 'header-three',
        onClick() {
          const temp = RichUtils.toggleBlockType(editorState, 'header-three');
          const newEditorState = takeSelectionFocus(temp);
          if (onChange) onChange(newEditorState);
        },
      },
      {
        name: 'OL',
        tooltip: (
          <>
            <ol style={listStyle}>
              <li>🌞</li>
              <li>🌛</li>
            </ol>
            <span>Ctrl+Alt+O</span>
          </>
        ),
        component: <Icon name="ol" />,
        active: RichUtils.getCurrentBlockType(editorState) === 'ordered-list-item',
        onClick() {
          const temp = RichUtils.toggleBlockType(editorState, 'ordered-list-item');
          const newEditorState = takeSelectionFocus(temp);
          if (onChange) onChange(newEditorState);
        },
      },
      {
        name: 'UL',
        tooltip: (
          <>
            <ul style={listStyle}>
              <li>🌞</li>
              <li>🌛</li>
            </ul>
            <span>Ctrl+Alt+U</span>
          </>
        ),
        component: <Icon name="ul" />,
        active: RichUtils.getCurrentBlockType(editorState) === 'unordered-list-item',
        onClick() {
          const temp = RichUtils.toggleBlockType(editorState, 'unordered-list-item');
          const newEditorState = takeSelectionFocus(temp);
          if (onChange) onChange(newEditorState);
        },
      },
      {
        name: 'IMAGE',
        tooltip: '图片',
        component: <Icon name="image" />,
        onClick() {
          const res = createBlockEntity(editorState, 'IMAGE', 'MUTABLE', {
            initial: true,
            type: 'local', // 'local', 'remote'
            src: '',
            width: 280,
            height: '',
          });
          const newEditorState = AtomicBlockUtils.insertAtomicBlock(
            res.editorState,
            res.entityKey,
            ' ',
          );
          if (onChange) onChange(newEditorState);
        },
      },
      {
        name: 'TABLE',
        tooltip: '表格',
        component: <CellSelector rows={10} cols={10} onSelect={handleCreateTable} />,
      },
      {
        name: 'FORMULA',
        tooltip: '数学公式',
        component: <Icon name="formula" />,
        onClick() {
          const res = createBlockEntity(editorState, 'FORMULA', 'MUTABLE', {
            initial: true,
            raw: '',
          });
          const newEditorState = AtomicBlockUtils.insertAtomicBlock(
            res.editorState,
            res.entityKey,
            ' ',
          );
          if (onChange) onChange(newEditorState);
        },
      },
      ...extraBarMaps,
    ],
    [editorState, extraBarMaps, handleCreateTable, onChange],
  );

  const computedBarMaps = useCallback(
    (_innerBars) => _innerBars
      .map((str, i) => {
        if (str === 'divider') return { name: 'divider', key: `divider${i}` };
        return defaultBarMaps.find((bar) => bar.name && bar.name.toLowerCase() === str);
      })
      .filter(Boolean),
    [defaultBarMaps],
  );

  const barMaps = useMemo(() => computedBarMaps(innerBars), [innerBars, computedBarMaps]);

  const computedWordLength = useCallback((_editorState, enabled) => {
    if (!enabled) return 0;
    const contentState = _editorState.getCurrentContent();
    let plainText = contentState.getPlainText();
    plainText = plainText.replace(/\n/g, '');
    return plainText.length;
  }, []);

  const wordLength = useMemo(
    () => computedWordLength(editorState, showNumberOfWords),
    [editorState, showNumberOfWords, computedWordLength],
  );

  return (
    <div className={styles.blockToolbar}>
      <ul className={styles.inner}>
        {barMaps.map((item) => {
          if (item.name === 'divider') {
            return <span key={item.key} className={styles.divider} />;
          }
          let TooltipComp = Fragment;
          let tooltipProps = {};
          if (item.tooltip) {
            TooltipComp = Tooltip;
            tooltipProps = { content: item.tooltip };
          }
          return (
            <li key={item.name}>
              <TooltipComp {...tooltipProps}>
                <button
                  className={cx('barButton', { active: item.active })}
                  type="button"
                  onClick={item.onClick}
                >
                  {item.component}
                </button>
              </TooltipComp>
            </li>
          );
        })}
        {showNumberOfWords && (
          <li>
            <span className={styles.sumWords}>{`${wordLength} 字`}</span>
          </li>
        )}
      </ul>
    </div>
  );
};

BlockToolbar.propTypes = {
  editorState: PropTypes.object,
  onChange: PropTypes.func,
  bars: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  extraBarMaps: PropTypes.array,
  showNumberOfWords: PropTypes.bool,
};

export default BlockToolbar;
