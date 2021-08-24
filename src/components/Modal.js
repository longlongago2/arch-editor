/* eslint-disable react/prop-types */
import React from 'react';
import ReactModal from 'react-modal';
import styles from './Modal.less';

ReactModal.setAppElement(document.body);

export default function Modal(props) {
  const { children } = props;
  return (
    <ReactModal
      {...props}
      className={styles.modalBody}
      overlayClassName={styles.modalOverlay}
      bodyOpenClassName={styles.reactModalBodyOpen}
    >
      {children}
    </ReactModal>
  );
}
