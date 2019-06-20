
// Helper to read URL parameters when using react-router.
export function readRouteParameter(componentProps: any, parameterId: string): string | undefined {
    const { match } = componentProps;
    return match && match.params && match.params[parameterId];
}


