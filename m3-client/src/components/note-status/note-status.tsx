import React from 'react';

interface NoteViewStatusProps {
  text: string;
}

export const NoteViewStatus = (props: NoteViewStatusProps) => {
  return (
    <div className="pa1 bg-light-blue">
      {props.text}
    </div>
  )
}
