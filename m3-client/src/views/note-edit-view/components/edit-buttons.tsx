import React from 'react';

interface Props {
  onSave: (() => void);
  onCancel: (() => void);
}

export const NoteViewEditButtons = (props: Props) => {
  return (
    <div className="flex flex-row mt2">
      <div data-component="button --primary" onClick={props.onSave}>Save</div>
      <div data-component="button" onClick={props.onCancel}>Cancel</div>
    </div>
  )
}