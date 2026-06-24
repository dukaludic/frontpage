import { prisma } from "@/lib/db";
import { parseFeed } from "./parser";
import { fetchFeed } from "./fetch";

//TODO: Optimize with raw SQL when the load gets too high
export async function refreshFeed(feedId: string) {
    const feed = await prisma.feed.findUnique({
        where: { id: feedId },
    });

    if (!feed) {
        throw new Error("Feed not found");
    }

    const feedText = await fetchFeed(feed.url);

    if (!feedText) {
        throw new Error("Failed to fetch feed");
    }

    const feedData = await parseFeed(feedText);

    if (!feedData) {
        throw new Error("Failed to parse feed");
    }

    for (const item of feedData.items) {
        if (!item.url) continue;

        await prisma.feedItem.upsert({
            where: {
                feed_id_url: { feed_id: feedId, url: item.url },
            },
            create: {
                feed_id: feedId,
                title: item.title,
                url: item.url,
                description: item.description,
                published_at: item.published_at,
            },
            update: {
                title: item.title,
                description: item.description,
                published_at: item.published_at,
            },
        });
    }
}

export async function refreshAllFeeds() {
    const feeds = await prisma.feed.findMany();
    for (const feed of feeds) {
        await refreshFeed(feed.id);
    }
}