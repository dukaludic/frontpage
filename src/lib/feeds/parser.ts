import Parser from "rss-parser";
import { ParsedFeed, ParsedFeedItem } from "./types";
import { fetchFeed } from "./fetch";

export async function parseFeed(feed: string): Promise<ParsedFeed | null> {
    const parser = new Parser();

    try {
        const json = await parser.parseString(feed);
        return normalizeFeed(json);
    } catch (error) {
        if (error instanceof Error && error.message.includes('404')) {
            console.error(error);
            return null;
        }

        if (error instanceof Error && error.message.includes('HTML')) {
            console.error(error);
            return null;
        }

        console.error(error);
        return null;
    }
}

function normalizeFeed(feed: Parser.Output<Parser.Item>): ParsedFeed {
    return {
        feed: {
            title: feed.title ?? '',
            url: feed.link ?? '',
        },
        items: [feed.items.map((item: Record<string, any>) => ({
            title: item.title ?? 'Untitled',
            url: item.link ?? 'No URL',
            description: item.content ?? item.contentSnippet ?? item.summary ?? '',
            published_at: new Date(item.pubDate ?? ''),
        }))[0]],
    }
}


parseFeed(await fetchFeed("https://www.reddit.com/") ?? "").then((result) => {
    console.log(result);
});