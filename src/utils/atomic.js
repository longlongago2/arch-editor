/* eslint-disable react/prop-types */
import React, { useMemo, useCallback } from 'react';
import Icon from '@/components/Icon';
import styles from '../index.less';

// Custom Block Components: blockRendererFn
export function atomic(Comp) {
  return function HOC({ blockProps = {}, block }) {
    const { entityKey, activeEntityKey, setActiveEntityKey } = blockProps;

    const editing = useMemo(() => activeEntityKey === entityKey, [activeEntityKey, entityKey]);

    const setEditing = useCallback(
      (v, callback) => {
        setActiveEntityKey(v ? entityKey : '', callback);
      },
      [entityKey, setActiveEntityKey],
    );

    // composite props
    const props = {
      ...blockProps,
      block,
      editing,
      setEditing,
    };
    return <Comp {...props} />;
  };
}

// Custom Block Components: toolbar
// popover toolbar hooks
export const useToolbar = ({ editing, onOk, onEdit, onDelete, onCancel }) => useMemo(
  () => (
    <span className={styles.popoverButtonGroup}>
      {editing && (
      <>
        <button type="button" className={styles.popoverButton} onClick={onCancel}>
          <Icon name="arrow-backward" />
        </button>
        <span className={styles.popoverDivider} />
      </>
      )}
      {editing ? (
        <button type="button" className={styles.popoverButton} onClick={onOk}>
          <Icon name="done" />
        </button>
      ) : (
        <button type="button" className={styles.popoverButton} onClick={onEdit}>
          <Icon name="edit" />
        </button>
      )}
      <span className={styles.popoverDivider} />
      <button type="button" className={styles.popoverButton} onClick={onDelete}>
        <Icon name="close" />
      </button>
    </span>
  ),
  [editing, onCancel, onDelete, onEdit, onOk],
);

// common toolbar component
export const EditToolbar = (props) => {
  const { className, onCancel, onOk, onDelete } = props;
  let _className = styles.editToolbar;
  _className += ` ${className}`;
  return (
    <div className={_className}>
      <button type="button" title="返回" onClick={onCancel}>
        <Icon name="arrow-backward" />
      </button>
      <button type="button" title="提交" onClick={onOk}>
        <Icon name="done" />
      </button>
      <button type="button" title="移除" onClick={onDelete} className={styles.danger}>
        <Icon name="close" />
      </button>
    </div>
  );
};
