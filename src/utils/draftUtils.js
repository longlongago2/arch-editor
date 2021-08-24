/* eslint-disable no-plusplus */
import { EditorState, SelectionState, RichUtils, Modifier, CompositeDecorator } from 'draft-js';
import { defaultStrategy } from '@/utils/default';

/**
 * @description ctrate a block entity
 * @export
 * @param {EditorState} editorState
 * @param {string} entityType
 * @param {'MUTABLE' | 'IMMUTABLE' | 'SEGMENTED'} entityMutability
 * @param {*} data
 * @return {{ entityKey: string, editorState: EditorState }}
 */
export function createBlockEntity(editorState, entityType, entityMutability, data) {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(entityType, entityMutability, data);
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
  return { entityKey, editorState: newEditorState };
}

/**
 * @description Removes a block entity (turning the block type into the unstyled type), and placing the selection on it.
 * @export
 * @param {ContentBlock} block
 * @param {EditorState} editorState
 * @return {EditorState}
 */
export function removeBlockEntity(block, editorState) {
  const contentState = editorState.getCurrentContent();
  const blockKey = block.getKey();
  const newBlock = block.merge({
    type: 'unstyled',
    text: '',
    characterList: block.getCharacterList().slice(0, 0), // No text = no character list
    data: {},
  });
  const blockMap = contentState.getBlockMap();
  const newContent = contentState.merge({ blockMap: blockMap.set(blockKey, newBlock) });
  let newEditorState = EditorState.push(editorState, newContent, 'change-block-type');
  const selection = SelectionState.createEmpty(blockKey);
  newEditorState = EditorState.forceSelection(newEditorState, selection);
  return newEditorState;
}

/**
 * @description update a block entity data (using mergeEntityData)
 * @export
 * @param {ContentBlock} block
 * @param {EditorState} editorState
 * @param {*} updateValue
 * @return {EditorState}
 */
export function updateBlockEntityData(block, editorState, updateValue) {
  const key = block.getEntityAt(0);
  const contentState = editorState.getCurrentContent();
  const nextContentState = contentState.mergeEntityData(key, updateValue);
  const newEditorState = EditorState.set(editorState, { currentContent: nextContentState });
  return newEditorState;
}

/**
 * @description clear all inline styles(include link)
 * @export
 * @param {EditorState} editorState
 * @return {EditorState}
 */
export function clearInlineStyles(editorState) {
  const selection = editorState.getSelection();
  if (selection.isCollapsed()) return editorState;
  // clear link
  const _editorState = RichUtils.toggleLink(editorState, selection, null);
  // clear inline styles
  const initialContentState = _editorState.getCurrentContent();
  const contentState = ['BOLD', 'ITALIC', 'UNDERLINE', 'STRIKETHROUGH', 'CODE'].reduce(
    (_contentState, inlineStyle) => Modifier.removeInlineStyle(_contentState, selection, inlineStyle),
    initialContentState,
  );
  return EditorState.push(_editorState, contentState, 'change-inline-style');
}

/**
 * @description get selection blocks
 * @export
 * @param {EditorState} editorState
 * @return {string}
 */
export function getSelectionBlocks(editorState) {
  const selectionState = editorState.getSelection();
  const startKey = selectionState.getStartKey();
  const endKey = selectionState.getEndKey();
  const currentContent = editorState.getCurrentContent();
  let begin = false;
  const selectionBlocks = [];
  const blockArr = currentContent.getBlocksAsArray();
  for (let i = 0; i < blockArr.length; i++) {
    const block = blockArr[i];
    const key = block.getKey();
    if (key === startKey) begin = true;
    if (begin) selectionBlocks.push(block);
    if (key === endKey) break;
  }

  return selectionBlocks;
}

/**
 * @description get new editorState by keep the selection to be focused
 * @export
 * @param {EditorState} editorState
 * @param {Boolean} hasFocus
 * @return {EditorState}
 */
export function takeSelectionFocus(editorState, hasFocus = true) {
  const selectionState = editorState.getSelection();
  const updatedSelection = selectionState.merge({ hasFocus });
  return EditorState.forceSelection(editorState, updatedSelection);
}

/**
 * @description get block type from selection
 * @export
 * @param {EditorState} editorState
 * @return {DraftBlockType}
 */
export function getBlockTypeFromSelection(editorState) {
  const selectionState = editorState.getSelection();
  const anchorKey = selectionState.getAnchorKey();
  const currentContent = editorState.getCurrentContent();
  const currentContentBlock = currentContent.getBlockForKey(anchorKey);
  return currentContentBlock.getType();
}

/**
 * @description Verify if InlineToolbar should be displayed
 * @export
 * @param {EditorState} editorState
 * @return {Boolean}
 */
export function validateSelection(editorState) {
  const selectedBlocks = getSelectionBlocks(editorState);
  if (selectedBlocks.length > 1) return false; // Do not show when multiple rows are selected
  const type = getBlockTypeFromSelection(editorState);
  if (type === 'atomic') return false; // Do not show when selected block type is 'atomic'
  return true;
}

/**
 * @description Force re-render of Editor: to resolve blockRendererFn do not re-render https://github.com/facebook/draft-js/issues/458
 * @export
 * @param {EditorState} editorState
 * @return {EditorState}
 */
export function forceReRender(editorState) {
  const contentState = editorState.getCurrentContent();
  const newEditorState = EditorState.createWithContent(contentState, new CompositeDecorator(defaultStrategy));
  const copyOfEditorState = EditorState.set(newEditorState, {
    selection: editorState.getSelection(),
    undoStack: editorState.getUndoStack(),
    redoStack: editorState.getRedoStack(),
    lastChangeType: editorState.getLastChangeType(),
  });
  return copyOfEditorState;
}
