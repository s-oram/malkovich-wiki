import React, { Fragment, ReactNode } from 'react';
import styles from './dialog-wrapper.module.scss';

interface DialogWrapperProps {
  isVisible?: boolean;
  children?: ReactNode;
}

export const DialogWrapper = (props: DialogWrapperProps) => {
  const isVisible = props.isVisible === undefined
    ? true
    : props.isVisible;

  const dialogWrapperStyle = styles.dialogWrapper + " absolute w-100 h-100 tc";

  const output = isVisible
    ? <div className={dialogWrapperStyle}>{props.children}</div>
    : null;

  return (
    <Fragment>
      {output}
    </Fragment>
  );
}

