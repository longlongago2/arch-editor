import 'katex/dist/katex.min.css';
import React, { useCallback, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { BlockMath } from 'react-katex';
import { removeBlockEntity, updateBlockEntityData } from '@/utils/draftUtils';
import { useToolbar, EditToolbar } from '@/utils/atomic';
import Tooltip from '@/components/Tooltip';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal';
import LaTexDoc from '@/components/LaTexDoc';
import styles from './AtomicFormula.less';

const cx = classNames.bind(styles);

export default function AtomicFormula(props) {
  // props
  const { block, data, readOnly, editorState, setEditorState, editing, setEditing } = props;

  // ref
  const inputRef = useRef(null);

  // state
  const [raw, setRaw] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // effect
  useEffect(() => {
    // initial status
    if (data.initial) {
      setEditing(true);
    }
  }, [data, setEditing]);

  useEffect(() => {
    // 编辑状态更改：手动初始化数据
    setRaw(data.raw);
  }, [data, editing]);

  // handler
  const execRemoveAction = useCallback(() => {
    const newEditorState = removeBlockEntity(block, editorState);
    setEditorState(newEditorState);
  }, [block, editorState, setEditorState]);

  const execSubmitAction = useCallback(() => {
    const newEditorState = updateBlockEntityData(block, editorState, { raw, initial: false });
    setEditorState(newEditorState);
  }, [block, editorState, raw, setEditorState]);

  const handleEdit = useCallback(() => {
    setEditing(true);
  }, [setEditing]);

  const handleSubmit = useCallback(() => {
    if (!raw) return;
    setEditing(false, () => {
      execSubmitAction();
    });
  }, [execSubmitAction, raw, setEditing]);

  const handleDelete = useCallback(() => {
    if (editing) {
      setEditing(false, () => {
        execRemoveAction();
      });
      return;
    }
    execRemoveAction();
  }, [editing, execRemoveAction, setEditing]);

  const handleCancel = useCallback(() => {
    setEditing(false);
  }, [setEditing]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleMathError = useCallback((err) => <div className={styles.tipInfo}>{err.message}</div>, []);

  const handleInputChange = (e) => {
    setRaw(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.keyCode === 13) {
      // Ctrl + Enter
      handleSubmit();
    }
    if (e.keyCode === 27) {
      // Esc
      handleCancel();
    }
  };

  const toolbar = useToolbar({
    editing: false,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const core = raw ? (
    <BlockMath math={String.raw`${raw}`} renderError={handleMathError} />
  ) : (
    <span className={styles.placeholder}>
      公式展示区
      {!editing && '（无公式）'}
    </span>
  );

  if (readOnly) {
    // 只读模式无法操作，只负责静态渲染
    return <div className={styles.formula}>{core}</div>;
  }

  if (editing) {
    return (
      <div className={styles.formulaContainer}>
        <div className={cx('formula', { active: editing })}>
          {core}
          <textarea
            className={styles.inputTex}
            placeholder="请输入Tex表达式(Ctrl+Enter 提交，Esc 返回)"
            ref={inputRef}
            value={raw}
            onChange={handleInputChange}
            autoFocus
            rows={3}
            onKeyDown={handleKeyDown}
          />
          <div className={styles.adviseInfo}>
            <Icon name="question" style={{ fontSize: 15, marginRight: 3 }} />
            <span>
              您还不了解Tex表达式？
              <button type="button" onClick={() => setModalOpen(true)}>
                查看规则
              </button>
            </span>
          </div>
        </div>
        <EditToolbar onCancel={handleCancel} onOk={handleSubmit} onDelete={handleDelete} />
        <Modal isOpen={modalOpen} onRequestClose={handleModalClose}>
          <LaTexDoc />
        </Modal>
      </div>
    );
  }

  return (
    <Tooltip content={toolbar}>
      <div className={styles.formula}>{core}</div>
    </Tooltip>
  );
}

AtomicFormula.propTypes = {
  block: PropTypes.object,
  data: PropTypes.any,
  readOnly: PropTypes.bool,
  editorState: PropTypes.object,
  setEditorState: PropTypes.func,
  editing: PropTypes.bool,
  setEditing: PropTypes.func,
};
