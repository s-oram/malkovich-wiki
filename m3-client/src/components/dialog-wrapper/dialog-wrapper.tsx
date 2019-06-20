import React, { Fragment, ReactNode } from 'react';

interface DialogWrapperProps {
  isVisible?: boolean;
  children?: ReactNode;
}

export const DialogWrapper = (props: DialogWrapperProps) => {
  const isVisible = props.isVisible === undefined
    ? true
    : props.isVisible;

  const output = isVisible
    ? <div className="absolute w-100 h-100 tc bg-silver">{props.children}</div>
    : null;

  return (
    <Fragment>
      {output}
    </Fragment>
  );
}

