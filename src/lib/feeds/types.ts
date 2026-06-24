export interface ParsedFeedItem {
    title?: string;
    url: string;
    description?: string;
    published_at: Date;
}

export interface ParsedFeed {
    feed: {
        title?: string;
        url: string;
    };
    items: ParsedFeedItem[];
}

export enum FeedHealthStatus {
    Healthy = "Healthy",
    Unreachable = "Unreachable",
    Invalid = "Invalid",
}

export type FetchResult =
    | { ok: true; body: string }
    | { ok: false; kind: "http"; status: number; message: string }
    | { ok: false; kind: "timeout"; message: string }
    | { ok: false; kind: "network"; message: string };

export interface RSS2Feed {
    rss: {
        channel: {
            title: string;
            link: string;
            description: string;
            item: RSS2FeedItem[];
        }
    }
}

export interface RSS2FeedItem {
    title: string;
    link: string;
    description: string;
    pubDate: string;
}

export interface RSS1Feed {
    "rdf:RDF": RDFRoot;
}

export interface RDFRoot {
    "@_xmlns:rdf": string;
    "@_xmlns": string;

    channel: RSS1Channel;
    item: RSS1FeedItem[];
}

export interface RSS1Channel {
    "@_rdf:about"?: string;

    title: string;
    link: string;
    description?: string;

    items?: {
        "rdf:Seq": {
            "rdf:li": Array<{
                "@_rdf:resource": string;
            }>;
        };
    };
}

export interface RSS1FeedItem {
    "@_rdf:about"?: string;

    title?: string;
    link?: string;
    description?: string;
    "dc:date"?: string;
}

export interface AtomFeed {
    feed: AtomFeedRoot;
}

export interface AtomFeedRoot {
    id: string;
    title: string;
    updated: string;
    link: AtomLink | AtomLink[];
    author?: AtomPerson | AtomPerson[];
    subtitle?: string;
    entry: AtomEntry[];
}

export interface AtomLink {
    ['@_href']: string;
    ['@_rel']: "alternate" | "self" | string;
}

export interface AtomPerson {
    name?: string;
    email?: string;
    uri?: string;
}

export interface AtomEntry {
    id: string;
    title?: string;
    updated: string;
    link: AtomLink | AtomLink[];
    author?: AtomPerson | AtomPerson[];
    content?: string;
    summary?: string;
}