import React, { Fragment } from 'react';

export const WelcomeSlug = () => {
  return (
    <div className="">Welcome</div>
  );
};

interface PageSlugProps {
  routeId: string;
}

export const PageSlug = (props: PageSlugProps) => {
  return (
    <Fragment>
      <span className="mr1"><a href="/">Home</a></span>
      <span className="mr1">&gt;</span>
      <span className="">{props.routeId.replace(/_/g, ' ')}</span>
    </Fragment>
  );
};