export function defined<T>(value: any): value is Exclude<T, undefined> {
    return value !== undefined;
}

export function assertDefined<T>(value: T | undefined): T {
    if (value === undefined) {
        throw new Error('Value is not defined');
    } else {
        return value;
    }
}
