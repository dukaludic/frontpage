export interface ParsedFeedItem {
    title: string;
    url?: string;
    description: string;
    published_at: Date;
}

export interface ParsedFeed {
    feed: {
        title: string;
        url: string;
    };
    items: ParsedFeedItem[];
}