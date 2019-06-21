import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import './header-button.scss';

interface Props {
  onClick?: () => void;
  icon?: IconProp;
  text: string;
}

export const HeaderButton = (props: Props) => {
  return (
    <div className="HeaderButton" onClick={props.onClick}>
      {props.icon && <span className="HeaderButton-Icon"><FontAwesomeIcon icon={props.icon} size="xs" /></span>}
      <span>{props.text}</span>
    </div>
  );
}