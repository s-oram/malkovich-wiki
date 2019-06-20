const wikiLeakRegEx = /\[{2}((?:\w| )+)(?:\|((?:\w| )+))?\]{2}/;

// TODO:MED The convertWikiLinks functionality will likely need to
// be implemented as a showdown extension. It's it's current
// form, the wikilink replacer will run in code blocks, which
// isn't what we want. Code blocks shouldn't be modified.

const convertWikiLinks = (text: string): string => {
    let input: string;
    let output: string = text;
    while (true) {
        input = output;
        output = input.replace(wikiLeakRegEx, wikiLinkToMarkdownLink);
        if (input === output) {
            return output;
        }
    }
}

const wikiLinkToMarkdownLink = (link: string): string => {
    const match: RegExpMatchArray | null = link.match(wikiLeakRegEx);
    if (!match) {
        return link;
    }
    let [, linkTarget, linkDisplay] = match;

    linkDisplay = linkDisplay || linkTarget;

    linkTarget = linkTarget && linkTarget.trim();
    linkDisplay = linkDisplay && linkDisplay.trim();

    linkTarget = linkTarget.replace(/ /g, '_');

    return `[${linkDisplay}](/${linkTarget})`
}

export default {
    convertWikiLinks
};