import React from 'react';
import { useGlobalState } from './store';
import { NoteReadView } from './views/note-read-view/note-read-view';
import Icons from './icons';
import { NoteEditView } from './views/note-edit-view/note-edit-view';

Icons.init();

const App: React.FC = () => {

  const [route] = useGlobalState('route');
  const [isEditing] = useGlobalState('isEditing');

  return (
    <div className="relative w-100 h-100">
      {route && route.type === 'page' && !isEditing && <NoteReadView pageId={route.pageId}/>}
      {route && route.type === 'page' && isEditing && <NoteEditView pageId={route.pageId} />}
    </div>
  );
}

export default App;
