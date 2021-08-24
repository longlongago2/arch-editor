/* eslint-disable no-cond-assign */
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/Icon';

// 如果只负责渲染，例如Link, 使用 CompositeDecorator 比较合适，
// 如果涉及到操作 editorState，例如：Table，则使用 blockRendererFn。

export function findEntitiesByType(type) {
  return (contentBlock, callback, contentState) => contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === type;
  }, callback);
}

export function findEntitiesByRegex(regex) {
  return (contentBlock, callback) => {
    const text = contentBlock.getText();
    let matchArr;
    let start;
    while ((matchArr = regex.exec(text)) !== null) {
      start = matchArr.index;
      callback(start, start + matchArr[0].length);
    }
  };
}

export const EntityLink = (props) => {
  const { contentState, entityKey, children, decoratedText } = props;
  let url;
  if (entityKey) {
    const data = contentState.getEntity(entityKey).getData();
    url = data.url;
  } else {
    url = decoratedText;
  }
  return (
    <a
      href={url}
      style={{ color: '#1F57C6', textDecoration: 'underline', position: 'relative', paddingRight: 20 }}
      title={url}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <Icon
        name="external-link"
        style={{ position: 'absolute', top: 0, right: 3, cursor: 'default', fontSize: 14, color: '#666' }}
      />
    </a>
  );
};

EntityLink.propTypes = {
  contentState: PropTypes.object,
  entityKey: PropTypes.string,
  children: PropTypes.array,
  decoratedText: PropTypes.string,
};

export const EntityEmail = (props) => {
  const { children, decoratedText } = props;
  const mail = `mailto:${decoratedText}`;
  return (
    <a
      href={mail}
      style={{ color: '#1F57C6', textDecoration: 'underline', position: 'relative', paddingRight: 20 }}
      title={mail}
    >
      {children}
      <Icon
        name="mail"
        style={{ position: 'absolute', top: 0, right: 3, cursor: 'default', fontSize: 14, color: '#666' }}
      />
    </a>
  );
};

EntityEmail.propTypes = {
  children: PropTypes.any,
  decoratedText: PropTypes.string,
};
