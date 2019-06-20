import { RequestStatus, MarkdownNote } from "./data-types";
import { AppRoute } from "../app-route";

// import { MarkdownNote } from "../data-types";

export interface State {
    count: number;
    text: string | undefined;
    name: string | undefined;
    route: AppRoute | null;
    note?: {
        id: string | undefined;
        data?: MarkdownNote | null;
        // ReadStatus will be used when requesting the note data from the server.
        readStatus: RequestStatus;
        readErrorMessage?: string;
        // WriteStatus will be used when saving the note data to the server.
        writeStatus?: RequestStatus.Pending | RequestStatus.Error;
        writeErrorMessage?: string;
    };
    isEditing: boolean;
    deletePageDialog: null | {
        pageId: string;
        deleteStatus?: RequestStatus.Pending | RequestStatus.Error;
    };
}

export const initialState: State = {
    count: 0,
    text: undefined,
    name: undefined,
    route: null,
    note: undefined,
    isEditing: false,
    deletePageDialog: null,
}