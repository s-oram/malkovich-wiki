import { Dispatch } from "react-hooks-global-state";
import { MarkdownNote } from "./data-types";
import { apiEndpoint } from "../config";
import { AppRoute } from "../app-route";
import page from 'page';

export type Action =
    | { type: 'setAppRoute'; route: AppRoute | null }
    | { type: 'setEdit'; isEditing: boolean }
    | { type: 'LoadNote.Request'; id: string | undefined }
    | { type: 'LoadNote.Success'; data: MarkdownNote | null }
    | { type: 'LoadNote.Failure'; errorMessage: string }
    | { type: 'SaveNote.Request'; id: string }
    | { type: 'SaveNote.Success'; data: MarkdownNote }
    | { type: 'SaveNote.Failure'; errorMessage: string }
    | { type: 'DeletePage.ShowConfirmationDialog'; pageId: string }
    | { type: 'DeletePage.HideConfirmationDialog'; }
    | { type: 'DeletePage.Request'; pageId: string }
    | { type: 'DeletePage.Success'; pageId: string }
    | { type: 'DeletePage.Failure'; pageId: string; errorMessage: string }


function createDeletePageActions(dispatch: Dispatch<Action>) {
    return {
        showConfirmationDialog: (pageId: string) => {
            dispatch({type: 'DeletePage.ShowConfirmationDialog', pageId: pageId})
        },

        hideConfirmationDialog: () => {
            dispatch({ type: 'DeletePage.HideConfirmationDialog' })
        },

        deletePage: async (pageId: string) => {
            dispatch({ type: 'DeletePage.Request', pageId: pageId });
            const endPoint = `${apiEndpoint}/api/notes/${encodeURI(pageId)}`;
            const method = 'DELETE';
            const response = await fetch(endPoint, { method });
            if (response.status === 200) {
                dispatch({ type: 'DeletePage.Success', pageId });
                page.redirect('/');
            } else {
                dispatch({ type: 'DeletePage.Failure', pageId, errorMessage: 'Something went wrong.' });
            }
        },
    }
}

export function createActions(dispatch: Dispatch<Action>) {
    return {
        setAppRoute: (value: AppRoute | null) => {
            dispatch({ type: 'setAppRoute', route: value });
        },

        setEdit: (isEditing: boolean) => {
            dispatch({ type: 'setEdit', isEditing })
        },

        loadNote: async (id: string) => {
            // TODO:MED The response handler will need to check the current state to see if the response
            // should be handled or ignored. For example, the user may have selected a different
            // page (which required another `loadNote` request.)
            dispatch({ type: 'LoadNote.Request', id: id });
            const response = await fetch(`${apiEndpoint}/api/notes/${encodeURI(id)}`);
            if (response.status === 200) {
                // TODO:MED Need to add JSON scheme validation.
                const json = await response.json() as MarkdownNote;
                dispatch({ type: "LoadNote.Success", data: json });
            } else if (response.status === 204) {
                dispatch({ type: "LoadNote.Success", data: null });

            } else {
                dispatch({ type: "LoadNote.Failure", errorMessage: 'Something went wrong.' });
            }
        },

        saveNote: async (id: string, data: MarkdownNote) => {
            // TODO:MED The response handler will need to check the current state to see if the response
            // should be handled or ignored. For example, the user may have cancelled the request.
            console.log(data);
            dispatch({ type: 'SaveNote.Request', id: id });
            // const response = await
            const response = await fetch(
                `${apiEndpoint}/api/notes/${encodeURI(id)}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    referrer: 'no-referrer',
                    body: JSON.stringify(data),
                }
            );
            if (response.status === 200) {
                dispatch({ type: "SaveNote.Success", data: data });
            } else {
                dispatch({ type: "SaveNote.Failure", errorMessage: 'Something went wrong.' });
            }
        },

        deletePageActions: createDeletePageActions(dispatch),

    }
}



