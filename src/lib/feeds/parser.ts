import { ParsedFeed, RSS2Feed, RSS2FeedItem, RSS1Feed, RSS1FeedItem, AtomFeed, AtomEntry } from "./types";
import { XMLParser } from "fast-xml-parser";
import util from "util";

export async function parseFeed(feed: string): Promise<ParsedFeed | null> {

    try {
        const type = detectRSSTypeFromXML(feed);

        const parser = new XMLParser({
            ignoreAttributes: false
        });

        const json = parser.parse(feed);

        switch (type) {
            case "rss2":
                return normalizeRSS2Feed(json);
            case "atom":
                return normalizeAtomFeed(json);
            case "rss1":
                return normalizeRSS1Feed(json);
            default:
                console.error(`Unknown RSS type: ${type}`);
                return null;
        }

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

function detectRSSTypeFromXML(xml: string) {
    const json = new XMLParser().parse(xml);

    if (json.rss?.channel) return "rss2";
    if (json.feed) return "atom";
    if (json["rdf:RDF"]) return "rss1";
    return "unknown";
}

function normalizeRSS2Feed(feed: RSS2Feed): ParsedFeed | null {
    const items = Array.isArray(feed.rss.channel.item) ? feed.rss.channel.item ?? [] : [feed.rss.channel.item];

    return {
        feed: {
            title: feed.rss.channel.title ?? '',
            url: feed.rss.channel.link ?? '',
        },
        items: items.map((item: RSS2FeedItem) => {
            const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();
            return {
                title: item.title ?? 'Untitled',
                url: item.link ?? 'No URL',
                description: item.description ?? '',
                published_at: publishedAt,
            }
        }) ?? [],
    }
}

function normalizeRSS1Feed(feed: RSS1Feed): ParsedFeed | null {
    const items = Array.isArray(feed["rdf:RDF"].item) ? feed["rdf:RDF"].item ?? [] : [feed["rdf:RDF"].item];

    return {
        feed: {
            title: feed["rdf:RDF"].channel.title,
            url: feed["rdf:RDF"].channel.link,
        },
        items: items.map((item: RSS1FeedItem) => {
            const publishedAt = item['dc:date'] ? new Date(item['dc:date']) : new Date();
            return {
                title: item.title,
                url: item.link,
                description: item.description,
                published_at: publishedAt,
            }
        }) ?? [],
    }
}

function normalizeAtomFeed(feed: AtomFeed): ParsedFeed | null {

    console.log(util.inspect(feed, { depth: null }));

    const feedUrl = Array.isArray(feed.feed.link) ? feed.feed.link[0] : feed.feed.link;
    const feedEntries = Array.isArray(feed.feed.entry) ? feed.feed.entry : [feed.feed.entry];

    return {
        feed: {
            title: feed.feed.title,
            url: feedUrl['@_href'] ?? '',
        },
        items: feedEntries.map((item: AtomEntry) => {
            const link = Array.isArray(item.link) ? item.link[0] : item.link;
            return {
                title: item.title,
                url: link['@_href'],
                description: item.summary ?? item.content,
                published_at: new Date(item.updated),
            }
        }) ?? [],
    }
}