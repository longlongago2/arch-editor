import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

export default function CellSelector(props) {
  const { onSelect, rows, cols } = props;

  const handleClick = useCallback(() => {
    if (onSelect) onSelect();
  }, [onSelect]);

  return (
    <table>
      <tbody onClick={handleClick}>
        {new Array(rows).fill().map(() => (
          <tr>
            {new Array(cols).fill().map(() => (
              <td />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

CellSelector.propTypes = {
  onSelect: PropTypes.func,
  rows: PropTypes.number,
  cols: PropTypes.number,
};
