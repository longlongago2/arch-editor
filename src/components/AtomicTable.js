import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { updateBlockEntityData, removeBlockEntity } from '@/utils/draftUtils';
import { defaultDecorator } from '@/utils/default';
import { useToolbar, EditToolbar } from '@/utils/atomic';
import Tooltip from '@/components/Tooltip';
import Icon from '@/components/Icon';
import styles from './AtomicTable.less';
import styles2 from '../index.less';

const cx = classNames.bind(styles);

// TODO: todoList
// ✔ 1.编辑状态控制 editing IMP: 控制何时编辑，何时提交，预期和其他实体的操作逻辑一致。有bug
// ✔ 2.提交时数据转换 editorState convert to contentStateRaw to storage
// 3.初始化选择几行几列
// 4.BlockToolbar 作用对象切换table内部editor，table内部无缝支持富文本
// 5.添加/删除 行和列
// 6.合并单元格

function convertRowsFromRaw(rows) {
  return rows.map((r) => ({
    key: r.key,
    columns: r.columns.map((c) => {
      const contentState = convertFromRaw(c.rawContentState);
      const editorStateWithDecorator = EditorState.createWithContent(
        contentState,
        defaultDecorator,
      );
      return {
        key: c.key,
        editorState: editorStateWithDecorator,
      };
    }),
  }));
}

function convertRowsToRaw(rows) {
  return rows.map((r) => ({
    key: r.key,
    columns: r.columns.map((c) => {
      const contentState = c.editorState.getCurrentContent();
      const rawContentState = convertToRaw(contentState);
      return {
        key: c.key,
        rawContentState,
      };
    }),
  }));
}

// 尽量保证 set editorState 独立执行 https://draftjs.org/docs/advanced-topics-issues-and-pitfalls#delayed-state-updates
export default function AtomicTable(props) {
  // props
  const {
    block,
    data = {},
    readOnly,
    editorState,
    setEditorState,
    editing,
    setEditing,
    Editor,
  } = props;

  // ref
  const atomicTable = useRef(null);

  // state
  const [rows, setRows] = useState([]);

  // effect
  useEffect(() => {
    // initial state: 初次创建处于编辑状态
    let timer;
    if (data.initial) {
      setEditing(true, () => {
        timer = setTimeout(() => {
          if (atomicTable.current) atomicTable.current.scrollIntoView();
        }, 0);
      });
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [data, setEditing]);

  useEffect(() => {
    const compositeRows = convertRowsFromRaw(data.rows);
    setRows(compositeRows);
  }, [data, editing]);

  // handler
  const execSubmitAction = useCallback(() => {
    const nextRows = convertRowsToRaw(rows); // 转换成可存储的数据
    const newEditorState = updateBlockEntityData(block, editorState, {
      rows: nextRows,
      initial: false,
    });
    setEditorState(newEditorState);
  }, [block, editorState, rows, setEditorState]);

  const execRemoveAction = useCallback(() => {
    const newEditorState = removeBlockEntity(block, editorState);
    setEditorState(newEditorState);
  }, [block, editorState, setEditorState]);

  const handleChange = useCallback(
    (value, pos) => {
      // change local data
      const [ri, ci] = pos; // row index, column index
      const nextRows = rows.concat();
      nextRows[ri].columns[ci].editorState = value;
      setRows(nextRows);
    },
    [rows],
  );

  const handleEdit = useCallback(() => {
    setEditing(true);
  }, [setEditing]);

  const handleCancel = useCallback(() => {
    setEditing(false);
  }, [setEditing]);

  const handleSubmit = useCallback(() => {
    setEditing(false, () => {
      execSubmitAction();
    });
  }, [execSubmitAction, setEditing]);

  const handleDelete = useCallback(() => {
    if (editing) {
      setEditing(false, () => {
        execRemoveAction();
      });
      return;
    }
    execRemoveAction();
  }, [editing, execRemoveAction, setEditing]);

  const toolbarColumn = useMemo(
    () => (
      <span className={`${styles2.popoverButtonGroup} ${styles2.large}`}>
        <button type="button" className={styles2.popoverButton}>
          <Icon name="insert-column-left" />
        </button>
        <span className={styles2.popoverDivider} />
        <button type="button" className={styles2.popoverButton}>
          <Icon name="insert-column-right" />
        </button>
        <span className={styles2.popoverDivider} />
        <button type="button" className={styles2.popoverButton}>
          <Icon name="delete-column" />
        </button>
      </span>
    ),
    [],
  );

  const toolbarRow = useMemo(
    () => (
      <span className={`${styles2.popoverButtonGroup} ${styles2.large}`}>
        <button type="button" className={styles2.popoverButton}>
          <Icon name="insert-row-above" />
        </button>
        <span className={styles2.popoverDivider} />
        <button type="button" className={styles2.popoverButton}>
          <Icon name="insert-row-below" />
        </button>
        <span className={styles2.popoverDivider} />
        <button type="button" className={styles2.popoverButton}>
          <Icon name="delete-row" />
        </button>
      </span>
    ),
    [],
  );

  const toolbarEdit = useToolbar({
    editing: false,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const core = (
    <table className={cx({ readonly: !editing })}>
      <tbody>
        {editing && (
          <tr className={styles.columnBar}>
            {rows[0] &&
              rows[0].columns.map(({ key }) => (
                <Tooltip content={toolbarColumn} key={key}>
                  <td />
                </Tooltip>
              ))}
            <td className={styles.last} />
          </tr>
        )}
        {rows.map(({ key, columns }, i) => (
          <tr key={key}>
            {columns.map((item, j) => (
              <td key={item.key}>
                <Editor
                  editorKey={item.key}
                  editorState={item.editorState}
                  onChange={(v) => handleChange(v, [i, j])}
                  readOnly={!editing}
                />
              </td>
            ))}
            {editing && (
              <Tooltip content={toolbarRow} placement="right">
                <td className={styles.rowBar} />
              </Tooltip>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (readOnly) {
    return <div className={styles.atomicTable}>{core}</div>;
  }

  if (editing) {
    return (
      <div className={styles.atomicTable} ref={atomicTable}>
        {core}
        <EditToolbar
          className={styles.editToolbar}
          onCancel={handleCancel}
          onOk={handleSubmit}
          onDelete={handleDelete}
        />
      </div>
    );
  }

  return (
    <Tooltip content={toolbarEdit}>
      <div className={styles.atomicTable}>{core}</div>
    </Tooltip>
  );
}

AtomicTable.propTypes = {
  block: PropTypes.object,
  data: PropTypes.any,
  readOnly: PropTypes.bool,
  editorState: PropTypes.object,
  setEditorState: PropTypes.func,
  editing: PropTypes.bool,
  setEditing: PropTypes.func,
  Editor: PropTypes.elementType,
};
