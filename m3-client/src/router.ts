import { actions } from "./store";
import page from 'page';
import { assertDefined } from "./utils/defined";

const index = (ctx: PageJS.Context, next: () => any) => {
    const pageId = 'index';
    actions.setAppRoute({
        type: 'page',
        pageId: pageId,
    });
    actions.loadNote(pageId);
}

const pageView = (ctx: PageJS.Context, next: () => any) => {
    const pageId = assertDefined(ctx.params['pageId']);
    actions.setAppRoute({
        type: 'page',
        pageId: pageId,
    });
    actions.loadNote(pageId);
}

export default {
    init: () => {
        page('/', index);
        page('/pages/:pageId', pageView);

        page('/pages/', index);

        page('/pages/', () => {
            page.redirect(`/`);
        });

        page('/:pageId', (ctx: PageJS.Context) => {
            const pageId = assertDefined(ctx.params['pageId']);
            page.redirect(`/pages/${pageId}`);
        });

        page();
    },
}
