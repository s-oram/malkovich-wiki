export function pascalCaseToSnakeCase(value: string): string {
    return value.split(/([A-Z]+[a-z0-9]+)/).filter(x => x !== '').join('_').toLowerCase();
}

