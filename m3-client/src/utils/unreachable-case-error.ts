// Source: https://stackoverflow.com/a/52913382/395461
export class UnreachableCaseError extends Error {
    constructor(val: never) {
        super(`Unreachable case: ${val}`);
    }
}
