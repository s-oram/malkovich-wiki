import React from 'react';
import DOMPurify from 'dompurify';

interface Props {
  html: string;
}

export const SafeHtml = (props: Props) => {

  const cleanHtml = DOMPurify.sanitize(props.html);

  return (
    <div dangerouslySetInnerHTML={{__html: cleanHtml}}></div>
  );
}
