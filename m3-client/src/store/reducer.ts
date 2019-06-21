import { State } from "./state";
import { Action } from "./actions";
import { UnreachableCaseError } from "../utils/unreachable-case-error";
import { produce } from "immer";
import { RequestStatus } from "./data-types";
import { isPageRoute } from "../app-route";

export function reduce(state: State, action: Action): State {

    switch (action.type) {

        case 'setAppRoute':
            return produce(state, draft => {
                const oldPageRouteId = isPageRoute(state.route) && state.route.pageId;
                const newPageRouteId = isPageRoute(action.route) && action.route.pageId;
                if (oldPageRouteId !== newPageRouteId) {
                    draft.note = null;
                    draft.deletePageDialog = null;
                }
                draft.route = action.route;
            });

        case 'setEdit':
            return produce(state, draft => {
                draft.isEditing = action.isEditing;
            });

        case 'LoadNote.Request':
            return produce(state, draft => {
                draft.note = {
                    id: action.id,
                    readStatus: RequestStatus.Pending,
                }
            });

        case 'LoadNote.Success':
            return produce(state, draft => {
                draft.note!.readStatus = RequestStatus.Ok;
                draft.note!.data = action.data;
            });

        case 'LoadNote.Failure':
            return produce(state, draft => {
                draft.note!.readStatus = RequestStatus.Error;
                draft.note!.readErrorMessage = action.errorMessage;
            });

        case 'SaveNote.Request':
            return produce(state, draft => {
                draft.note!.writeStatus = RequestStatus.Pending;
                draft.note!.writeErrorMessage = undefined;
            });

        case 'SaveNote.Success':
            return produce(state, draft => {
                draft.note!.data = action.data;
                draft.note!.writeStatus = undefined;
                draft.note!.writeErrorMessage = undefined;
                draft.isEditing = false;
            });

        case 'SaveNote.Failure':
            return produce(state, draft => {
                draft.note!.writeStatus = RequestStatus.Error;
                draft.note!.writeErrorMessage = action.errorMessage;
            });

        case 'DeletePage.ShowConfirmationDialog':
            return produce(state, draft => {
                draft.deletePageDialog = {
                    pageId: action.pageId,
                };
            });

        case 'DeletePage.HideConfirmationDialog':
            return produce(state, draft => {
                draft.deletePageDialog = null;
            });

        case 'DeletePage.Request':
            return produce(state, draft => {
                draft.deletePageDialog!.deleteStatus = RequestStatus.Pending;
            });

        case 'DeletePage.Success':
            return produce(state, draft => {
                draft.deletePageDialog!.deleteStatus = RequestStatus.Ok;
            });

        case 'DeletePage.Failure':
            return produce(state, draft => {
                // TODO:HIGH
            });

        default:
            throw new UnreachableCaseError(action);
    }
}
