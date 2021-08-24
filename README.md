# ArchEditor

Rich text editor with customizable layout

## Documention

[简体中文](README.zh.md) | [English](README.md)

## Software Architecture

- Use React.js
- Based on Draft.js

## Installation

`npm install arch-editor --save`

#### Usage

```js
import React from 'react';
import ReactDOM from 'react-dom';
import 'arch-editor/dist/arch-editor.css';
import { ArchEditor, BlockToolbar, ArchEditorProvider } from 'arch-editor';

function App() {
  return (
    <ArchEditorProvider>
      <BlockToolbar />
      <ArchEditor placeholder="Please enter text." showInlineToolbar />
    </ArchEditorProvider>;
  );
}

ReactDOM.render(<App />,document.getElementById('root'));
```
