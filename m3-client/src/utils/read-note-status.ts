import { RequestStatus } from "../store/data-types";
import { State } from "../store/state";

export function readNoteStatus(note: State['note']): string | null {
    if (!note) {
        return null;

    } else if (note.readStatus === RequestStatus.Pending) {
        return null;

    } else if (note.readStatus === RequestStatus.Error) {
        return 'Cannot load note: ' + note.readErrorMessage;

    } else if (note.writeStatus === RequestStatus.Pending) {
        return null;

    } else if (note.writeStatus === RequestStatus.Error) {
        return 'Cannot save note: ' + note.writeErrorMessage;

    } else {
        return null;
    }
}
