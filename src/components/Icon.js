import React from 'react';
import PropTypes from 'prop-types';

export default function Icon(props) {
  const { name, style, onClick } = props;
  return (
    <svg
      onClick={onClick}
      style={{
        width: '1em',
        height: '1em',
        verticalAlign: '-0.15em',
        fill: 'currentColor',
        overflow: 'hidden',
        ...style,
      }}
      aria-hidden="true"
    >
      <use xlinkHref={`#arch-icon-${name}`} />
    </svg>
  );
}

Icon.propTypes = {
  name: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};
