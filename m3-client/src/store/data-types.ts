export enum RequestStatus {
    Pending = 'Pending', // Request has been sent. Waiting for result.
    Ok = 'Ok',           // Request has returned a result.
    Error = 'Error',     // Request failed.
}

export interface MarkdownNote {
    type: 'markdown';
    meta: any;
    text: string;
}
