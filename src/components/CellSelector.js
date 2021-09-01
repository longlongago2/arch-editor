/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { usePopper } from 'react-popper';
import classNames from 'classnames/bind';
import Icon from '@/components/Icon';
import styles from './CellSelector.less';

const cx = classNames.bind(styles);

export default function CellSelector(props) {
  // props
  const { onSelect, rows, cols } = props;

  // state
  const [pos, setPos] = useState([0, 0]);
  const [visible, setVisible] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles: _styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
    modifiers: [
      {
        name: 'offset',
        options: { offset: [0, 10] },
      },
      {
        name: 'flip',
        enabled: true,
      },
      {
        name: 'preventOverflow',
        options: { padding: 5 },
      },
      {
        name: 'computeStyles',
        options: { adaptive: false },
      },
    ],
  });

  // handler
  const handleMouseDown = () => {
    const [i, j] = pos;
    if (onSelect) onSelect([i + 1, j + 1]);
  };

  const handleMouseEnter = (i, j) => {
    setPos([i, j]);
  };

  const handleMouseLeave = () => {
    setPos([0, 0]);
  };

  const handleChangeVisible = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setVisible((v) => !v);
  };

  const handleRequestClose = useCallback(() => {
    setVisible(false);
  }, []);

  // effect
  useEffect(() => {
    document.body.addEventListener('click', handleRequestClose);
    return () => {
      document.body.removeEventListener('click', handleRequestClose);
    };
  }, [handleRequestClose]);

  return (
    <>
      <span onClick={handleChangeVisible} ref={setReferenceElement}>
        <Icon name="table" />
        <Icon name="chevron-down" style={{ fontSize: 12, verticalAlign: 'middle' }} />
      </span>
      {ReactDOM.createPortal(
        <table
          ref={setPopperElement}
          style={_styles.popper}
          className={cx('cellSelector', { hidden: !visible })}
          border={1}
          cellPadding={5}
          cellSpacing={4}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onBlur={handleMouseLeave}
          {...attributes.popper}
        >
          <tbody>
            {new Array(rows).fill().map((row, i) => (
              <tr key={i}>
                {new Array(cols).fill().map((col, j) => (
                  <td
                    className={cx({ active: pos[0] >= i && pos[1] >= j })}
                    key={j}
                    onMouseEnter={() => handleMouseEnter(i, j)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={cols}>{`${pos[0] + 1} × ${pos[1] + 1}`}</td>
            </tr>
          </tfoot>
        </table>,
        document.body,
      )}
    </>
  );
}

CellSelector.propTypes = {
  onSelect: PropTypes.func,
  rows: PropTypes.number,
  cols: PropTypes.number,
};
