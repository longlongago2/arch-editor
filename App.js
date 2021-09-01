/* eslint-disable no-console */
import { saveAs } from 'file-saver';
import React, { useRef, useState, useCallback, useMemo } from 'react';
// dev
import {
  ArchEditor,
  BlockToolbar,
  Icon,
  defaultEditorState,
  ArchEditorProvider,
  convertFromHTML,
  ContentState,
  EditorState,
} from './src';
// prod
// import {
//   ArchEditor,
//   BlockToolbar,
//   Icon,
//   defaultEditorState,
//   ArchEditorProvider,
//   convertFromHTML,
//   ContentState,
//   EditorState,
// } from './lib';
// import './dist/arch-editor.css';

import styles from './App.less';

function App() {
  // state
  const [editorState, setEditorState] = useState(defaultEditorState);

  // ref
  const editor = useRef(null);

  const fileData = useRef(null);

  // handler
  const handleGetRawData = () => {
    if (editor.current) {
      const data = editor.current.getEditorRaw();
      const json = JSON.stringify(data);
      const blob = new Blob([json], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'arch-editor.json');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, 'utf-8');
      reader.onload = (evt) => {
        fileData.current = evt.target.result;
      };
    }
  };

  const handleLoadHTMLData = () => {
    if (fileData.current) {
      const blocksFromHTML = convertFromHTML(fileData.current);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      );
      const newEditorState = EditorState.push(editorState, contentState, 'insert-fragment');
      setEditorState(newEditorState);
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
        <input type="file" accept="text/html" onChange={handleFileChange} />
        <button type="button" onClick={handleLoadHTMLData}>
          载入 HTML 数据
        </button>
        <button type="button" onClick={handleGetRawData}>
          下载 JSON 数据
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
      <ArchEditor
        className={styles.editor}
        popoverClassName={styles.popover}
        placeholder="请输入文本"
      />
    </div>
  );
}

export default App;
