import React, { useState } from 'react';
import { useGlobalState, actions } from '../../store';
import { readNoteStatus } from '../../utils/read-note-status';
import { NoteViewStatus } from '../../components/note-status/note-status';
import { MarkDownNote } from '../../components/markdown-note';
import { NoteViewEditButtons } from './components/edit-buttons';

interface Props {
  pageId: string;
}

export const NoteEditView = (props: Props) => {

  const pageId = props.pageId;
  const isIndexPage = pageId.toLowerCase() === 'index';
  const pageName = isIndexPage
    ? 'Welcome'
    : pageId.replace(/_/g, ' ');

  const [note] = useGlobalState('note');
  const savedText = note && note.data && note.data.text;
  const noteStatus = readNoteStatus(note);

  const [editText, setEditText] = useState<string | undefined>();

  const viewText = editText || savedText;

  const handleEditChange = (text: string) => {
    setEditText(text);
  };

  const handleSaveEdit = () => {
    if (editText) {
      actions.saveNote(
        pageId,
        {
          type: 'markdown',
          meta: undefined, // TODO:MED
          text: editText,
        }
      );
    } else {
      handleCancelEdit();
    }
  }

  const handleCancelEdit = () => {
    actions.setEdit(false);
    setEditText(undefined);
  }

  return (
    <div className="w-100 h-100 overflow-auto flex flex-column">
      {noteStatus && <NoteViewStatus text={noteStatus} />}

      <div className="pa1">
        Editing: {pageName}
      </div>

      <div className="pl1 pr1 pb1 flex flex-column flex-grow-1">
        <div className="flex-grow-1">
          {viewText !== undefined && <MarkDownNote text={viewText || ''} isEditing={true} onChange={handleEditChange} />}
        </div>
        <NoteViewEditButtons onSave={handleSaveEdit} onCancel={handleCancelEdit} />
      </div>
    </div>
  );
}