/* eslint-disable no-console */
import React, { useRef, useState, useCallback, useMemo } from 'react';
// dev
import { ArchEditor, BlockToolbar, Icon, defaultEditorState, ArchEditorProvider } from './src';
// prod
// import { ArchEditor, BlockToolbar, Icon, defaultEditorState, ArchEditorProvider } from './lib';
// import './dist/arch-editor.css';
import styles from './App.less';

function App() {
  // state
  const [editorState, setEditorState] = useState(defaultEditorState);

  // ref
  const editor = useRef(null);

  // handler
  const handleGetRawData = () => {
    if (editor.current) {
      const data = editor.current.getEditorRaw();
      console.log(data);
    }
  };

  const handleEditorChange = useCallback((v) => {
    setEditorState(v);
  }, []);

  const setCustomBars = useCallback((v) => [...v, 'input'], []);

  // memorized
  // 扩展工具栏，相应需要在bars里添加扩展的name; 见 setCustomBars
  const extraBarMaps = useMemo(
    () => [
      {
        name: 'input',
        tooltip: '参数',
        component: <Icon name="input" />,
        onClick() {
          // const newEditorState = null;
        },
      },
    ],
    [],
  );

  return (
    <div className={styles.app}>
      <h1>use prop editorState</h1>
      <div className={styles.buttonGroup}>
        <button type="button" onClick={handleGetRawData}>
          获取raw数据
        </button>
      </div>
      <BlockToolbar
        editorState={editorState}
        onChange={handleEditorChange}
        bars={setCustomBars}
        extraBarMaps={extraBarMaps}
        showNumberOfWords
      />
      <ArchEditor
        ref={editor}
        editorState={editorState}
        className={styles.editor}
        popoverClassName={styles.popover}
        placeholder="请输入文本"
        onChange={handleEditorChange}
      />
      <h1>use context editorState</h1>
      <ArchEditorProvider>
        <BlockToolbar bars={setCustomBars} extraBarMaps={extraBarMaps} />
        <ArchEditor
          className={styles.editor}
          popoverClassName={styles.popover}
          placeholder="请输入文本"
          showInlineToolbar
        />
      </ArchEditorProvider>
      <h1>use inner editorState</h1>
      <ArchEditor className={styles.editor} popoverClassName={styles.popover} placeholder="请输入文本" />
    </div>
  );
}

export default App;
