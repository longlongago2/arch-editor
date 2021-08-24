import { RichUtils, getDefaultKeyBinding, EditorState, CompositeDecorator } from 'draft-js';
import { findEntitiesByType, findEntitiesByRegex, EntityLink, EntityEmail } from '@/utils/composite';
import { clearInlineStyles } from '@/utils/draftUtils';

export const defaultKeyBindingFn = (e) => {
  if (e.keyCode === 76 && e.ctrlKey && e.altKey) {
    // Ctrl + Alt + L
    return 'format-clear';
  }
  if (e.keyCode === 79 && e.ctrlKey && e.altKey) {
    // Ctrl + Alt + O
    return 'ordered-list-item';
  }
  if (e.keyCode === 83 && e.ctrlKey && e.altKey) {
    // Ctrl + Alt + S
    return 'strikethrough';
  }
  if (e.keyCode === 84 && e.ctrlKey && e.altKey) {
    // Ctrl + Alt + T
    return 'unstyled';
  }
  if (e.keyCode === 85 && e.ctrlKey && e.altKey) {
    // Ctrl + Alt + U
    return 'unordered-list-item';
  }
  if (e.keyCode === 112 && e.ctrlKey && e.altKey) {
    // Ctrl + Alt + F1
    return 'header-one';
  }
  if (e.keyCode === 113 && e.ctrlKey && e.altKey) {
    // Ctrl + Alt + F2
    return 'header-two';
  }
  if (e.keyCode === 114 && e.ctrlKey && e.altKey) {
    // Ctrl + Alt + F3
    return 'header-three';
  }
  return getDefaultKeyBinding(e);
};

export const defaultCustomStyleMap = {
  STRIKETHROUGH: { textDecoration: 'line-through', textDecorationColor: 'red' },
  UNDERLINE: { textDecoration: 'underline', textDecorationColor: 'initial' },
};

export const getDefaultKeyCommandState = (command, editorState) => {
  switch (command) {
    case 'format-clear':
      return clearInlineStyles(editorState);
    case 'strikethrough':
      return RichUtils.toggleInlineStyle(editorState, 'STRIKETHROUGH');
    case 'header-one':
    case 'header-two':
    case 'header-three':
    case 'unstyled':
    case 'ordered-list-item':
    case 'unordered-list-item':
      return RichUtils.toggleBlockType(editorState, command);
    default:
      return RichUtils.handleKeyCommand(editorState, command);
  }
};

export const defaultStrategy = [
  {
    strategy: findEntitiesByType('LINK'),
    component: EntityLink,
  },
  {
    strategy: findEntitiesByRegex(/[a-zA-z]+:\/\/[^\s]*/g),
    component: EntityLink,
  },
  {
    strategy: findEntitiesByRegex(/[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/g),
    component: EntityEmail,
  },
];

export const defaultDecorator = new CompositeDecorator(defaultStrategy);

export const defaultEditorState = EditorState.createEmpty(defaultDecorator);
