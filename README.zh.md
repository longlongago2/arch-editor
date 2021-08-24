# ArchEditor

可自定义布局的富文本编辑器

## 文档

[简体中文](./README.zh.md) | [English](./README.md)

## 软件架构

- 使用 React.js
- 基于 Draft.js

## 安装教程

`npm install arch-editor --save`

## 使用说明

```js
import React from 'react';
import ReactDOM from 'react-dom';
import 'arch-editor/dist/arch-editor.css';
import { ArchEditor, BlockToolbar, ArchEditorProvider } from 'arch-editor';

function App() {
  return (
    <ArchEditorProvider>
      <BlockToolbar />
      <ArchEditor placeholder="请输入文本" showInlineToolbar />
    </ArchEditorProvider>;
  );
}

ReactDOM.render(<App />,document.getElementById('root'));
```

