import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Tooltip from '@/components/Tooltip';
import { removeBlockEntity, updateBlockEntityData } from '@/utils/draftUtils';
import { useToolbar, EditToolbar } from '@/utils/atomic';
import IMAGE from '@/static/default-image.png';
import styles from './AtomicImage.less';

const cx = classNames.bind(styles);

function fileToBase64(file, callback) {
  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = (e) => {
    callback(e.target.result);
  };
}

export default function AtomicImage(props) {
  // props
  const { block, data = {}, readOnly, editorState, setEditorState, editing, setEditing } = props;

  // ref
  const fileRef = useRef(null);
  const snapshot = useRef(null);

  // state
  const [imageObj, setImageObj] = useState({});

  // effect
  useEffect(() => {
    // initial state: 初次创建处于编辑状态
    if (data.initial) {
      setEditing(true);
    }
  }, [data, setEditing]);

  useEffect(() => {
    // 编辑手动初始化数据
    setImageObj(data);
    snapshot.current = { [data.type]: data };
  }, [data, editing]);

  // handler
  const execSubmitAction = useCallback(() => {
    const newEditorState = updateBlockEntityData(block, editorState, {
      ...imageObj,
      initial: false,
    });
    setEditorState(newEditorState);
  }, [block, editorState, imageObj, setEditorState]);

  const execRemoveAction = useCallback(() => {
    const newEditorState = removeBlockEntity(block, editorState);
    setEditorState(newEditorState);
  }, [block, editorState, setEditorState]);

  const handleEdit = useCallback(() => {
    setEditing(true);
  }, [setEditing]);

  const handleSubmit = useCallback(() => {
    const { src } = imageObj;
    if (!src) return;
    setEditing(false, () => {
      execSubmitAction();
    });
  }, [execSubmitAction, imageObj, setEditing]);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    fileToBase64(file, (base64) => {
      setImageObj((v) => ({ ...v, src: base64 }));
    });
  };

  const handleUrlChange = (e) => {
    setImageObj((v) => ({ ...v, src: e.target.value }));
  };

  const handleWidthChange = (e) => {
    setImageObj((v) => ({ ...v, width: e.target.value }));
  };

  const handleHeightChange = (e) => {
    setImageObj((v) => ({ ...v, height: e.target.value }));
  };

  const handleTypeChange = (e) => {
    // 切换type
    const nextType = e.target.value;
    const defaultImageData = { type: nextType, src: '', width: 280, height: '' };
    setImageObj((v) => {
      // 记录当前快照
      snapshot.current[v.type] = v;
      // 恢复之前快照
      return snapshot.current[nextType] || defaultImageData;
    });
  };

  const toolbarEdit = useToolbar({
    editing: false,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const core = imageObj.src ? (
    <img src={imageObj.src} width={imageObj.width} height={imageObj.height} alt={imageObj.src} />
  ) : (
    <img src={IMAGE} className={styles.defaultImage} alt="未选择图片" />
  );

  if (readOnly) {
    // 只读模式无法操作，只负责静态渲染
    return <div className={styles.atomicImage}>{core}</div>;
  }

  if (editing) {
    return (
      <div className={styles.atomicImageContainer}>
        <div className={cx('atomicImage', 'active')}>
          {core}
          <div className={styles.imageToolbar}>
            <div className={styles.row} style={{ marginBottom: 5 }}>
              <label className={styles.radioButton}>
                <input
                  name="imageType"
                  type="radio"
                  value="local"
                  checked={imageObj.type === 'local'}
                  onChange={handleTypeChange}
                />
                <span>本地资源</span>
              </label>
              <label className={styles.radioButton}>
                <input
                  name="imageType"
                  type="radio"
                  value="remote"
                  checked={imageObj.type === 'remote'}
                  onChange={handleTypeChange}
                />
                <span>远程资源</span>
              </label>
            </div>
            <div className={styles.row}>
              <span className={styles.col}>
                <span>宽：</span>
                <input
                  value={imageObj.width}
                  className={styles.inputNumber}
                  type="number"
                  onChange={handleWidthChange}
                />
              </span>
              <span className={styles.col}>
                <span>高：</span>
                <input
                  value={imageObj.height}
                  className={styles.inputNumber}
                  type="number"
                  onChange={handleHeightChange}
                />
              </span>
            </div>
            {imageObj.type === 'local' && (
              <div className={styles.row}>
                <span>地址：</span>
                <button
                  className={styles.inputButton}
                  type="button"
                  title="base64"
                  onClick={() => fileRef.current.click()}
                >
                  {imageObj.src || '请选择本地图片'}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/gif"
                    hidden
                    onChange={handleFileChange}
                  />
                </button>
              </div>
            )}
            {imageObj.type === 'remote' && (
              <div className={styles.row}>
                <span>地址：</span>
                <input
                  value={imageObj.src}
                  type="text"
                  className={styles.inputText}
                  onChange={handleUrlChange}
                  placeholder="请输入图片资源地址"
                />
              </div>
            )}
          </div>
        </div>
        <EditToolbar onCancel={handleCancel} onOk={handleSubmit} onDelete={handleDelete} />
      </div>
    );
  }

  return (
    <Tooltip content={toolbarEdit}>
      <div className={styles.atomicImage}>{core}</div>
    </Tooltip>
  );
}

AtomicImage.propTypes = {
  block: PropTypes.object,
  data: PropTypes.any,
  readOnly: PropTypes.bool,
  editorState: PropTypes.object,
  setEditorState: PropTypes.func,
  editing: PropTypes.bool,
  setEditing: PropTypes.func,
};
