import React, { Fragment } from 'react';
import { HeaderButton } from '../../../components/header-button/header-button';
import page from 'page';

export const WelcomeSlug = () => {
  return (
    <div className="">Welcome</div>
  );
};

interface PageSlugProps {
  routeId: string;
}

export const PageSlug = (props: PageSlugProps) => {
  const handleHomeButtonClick = () => {
    page.redirect('/');
  }
  return (
    <Fragment>
      <span className="mr1"><HeaderButton onClick={handleHomeButtonClick} text="Home"></HeaderButton></span>
      <span className="mr2">-</span>
      <span className="">{props.routeId.replace(/_/g, ' ')}</span>
    </Fragment>
  );
};