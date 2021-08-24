import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { usePopper } from 'react-popper';
import styles from './Tooltip.less';

const Tooltip = (props) => {
  const timer = useRef(null);
  const { children, content, placement = 'top', getContainer = () => document.body } = props;
  const [visible, setVisible] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const {
    styles: popperStyles,
    attributes,
    update,
  } = usePopper(referenceElement, popperElement, {
    strategy: 'fixed',
    placement,
    modifiers: [
      {
        name: 'arrow',
        options: { element: arrowElement },
      },
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
    ],
  });

  const toggle = (v) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setVisible(v);
    }, 200);
  };

  useEffect(() => {
    if (update) update();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [update, props]);

  let $children;
  if (React.Children.only(children)) {
    $children = React.cloneElement(children, {
      ref: setReferenceElement,
      onMouseEnter: () => toggle(true),
      onMouseLeave: () => toggle(false),
    });
  }

  const el = getContainer();

  return (
    <>
      {$children}
      {ReactDOM.createPortal(
        <CSSTransition in={visible} timeout={150} unmountOnExit classNames="ArchEditor-fade">
          <div
            className={styles.tooltip}
            ref={setPopperElement}
            style={popperStyles.popper}
            {...attributes.popper}
            onMouseEnter={() => toggle(true)}
            onMouseLeave={() => toggle(false)}
            contentEditable={false}
          >
            {content}
            <div className={styles.tooltipArrow} ref={setArrowElement} style={popperStyles.arrow} />
          </div>
        </CSSTransition>,
        el,
      )}
    </>
  );
};

Tooltip.propTypes = {
  content: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  children: PropTypes.object,
  placement: PropTypes.string,
  getContainer: PropTypes.func,
};

export default Tooltip;
