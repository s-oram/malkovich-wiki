
export interface PageRoute {
    type: 'page';
    pageId: string;
}

export function isPageRoute(value: any): value is PageRoute {
    return value && value.type === 'page';
}

export type AppRoute = PageRoute;
