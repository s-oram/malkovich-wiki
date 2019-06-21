import React from 'react';
import './note-read-view.scss';
import { actions, useGlobalState } from '../../store';
import { MarkDownNote } from '../../components/markdown-note';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WelcomeSlug, PageSlug } from './components/slug';
import { NoteViewStatus } from '../../components/note-status/note-status';
import { readNoteStatus } from '../../utils/read-note-status';
import { DialogWrapper } from '../../components/dialog-wrapper/dialog-wrapper';

interface Props {
  pageId: string;
}

export const NoteReadView = (props: Props) => {

  const pageId = props.pageId;
  const isIndexPage = pageId.toLowerCase() === 'index';
  const pageName = props.pageId.replace(/_/g, ' ')

  const [note] = useGlobalState('note');
  const savedText = note && note.data && note.data.text;
  const errorMessage = note && note.readErrorMessage;

  const [deletePageDialog] = useGlobalState('deletePageDialog');
  const isDeleteConfirmationVisible = deletePageDialog && deletePageDialog.pageId === pageId;

  const viewText = savedText;

  const noteStatus = readNoteStatus(note);

  const handleEditClick = () => {
    actions.setEdit(true);
  };

  const handleDeleteClick = () => {
    actions.deletePageActions.showConfirmationDialog(pageId);
  }

  const handleDeleteConfirm = () => {
    actions.deletePageActions.deletePage(pageId)
  }

  const handleDeleteCancel = () => {
    actions.deletePageActions.hideConfirmationDialog();
  }

  return (
    <div className="w-100 h-100 overflow-auto flex flex-column">
      <DialogWrapper isVisible={isDeleteConfirmationVisible || false}>
        <div className="pa3 mt3 bg-white dib br2">
          <div className="mb3">
            Delete {pageName}?
          </div>
          <div data-component="button --warning" className="dib" onClick={handleDeleteConfirm}>Delete</div>
          <div data-component="button" className="dib" onClick={handleDeleteCancel}>Cancel</div>
        </div>
      </DialogWrapper>

      {noteStatus && <NoteViewStatus text={noteStatus} />}

      {/* Header */}
      <div className="pa1 flex flex-row justify-between bb b--silver">

        <div className="">
          {isIndexPage ? <WelcomeSlug /> : <PageSlug routeId={pageId} /> }
        </div>

        <div>
          <div data-component="inline-button" className="mr1" onClick={handleEditClick}>
            <FontAwesomeIcon icon="edit" size="xs"></FontAwesomeIcon>
            <span>Edit</span>
          </div>
          <div data-component="inline-button" onClick={handleDeleteClick}>
            <FontAwesomeIcon icon="edit" size="xs"></FontAwesomeIcon>
            <span>Delete</span>
          </div>
        </div>
      </div>

      {/* Text View */}
      <div className="pa1 flex flex-column flex-grow-1">
        <div className="flex-grow-1">
          {errorMessage && <div>{errorMessage}</div>}
          {viewText === null && <div>
            This page is empty. <span onClick={handleEditClick}>Edit to add some content now...</span>
          </div>}
          {viewText !== undefined && <MarkDownNote text={viewText || ''} isEditing={false} />}
        </div>
      </div>
    </div>
  )
}
