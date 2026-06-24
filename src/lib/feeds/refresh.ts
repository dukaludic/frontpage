import { prisma } from "@/lib/db";
import { parseFeed } from "./parser";
import { fetchFeed } from "./fetch";
import { FeedHealthStatus } from "./types";

//TODO: Optimize with raw SQL when the load gets too high
export async function refreshFeed(feedId: string) {
    const feed = await prisma.feed.findUnique({
        where: { id: feedId },
    });

    if (!feed) {
        throw new Error("Feed not found");
    }

    const fetched = await fetchFeed(feed.url);

    if (!fetched.ok) {
        await updateFeedHealth(feedId, FeedHealthStatus.Unreachable, fetched.message);
        return;
    }

    const feedData = await parseFeed(fetched.body);

    if (!feedData) {
        await updateFeedHealth(
            feedId,
            FeedHealthStatus.Invalid,
            "Failed to parse feed",
        );
        return;
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

    await updateFeedHealth(
        feedId,
        FeedHealthStatus.Healthy,
        null,
        feedData.feed.title,
    );
}

export async function refreshAllFeeds() {
    const feeds = await prisma.feed.findMany();
    await Promise.allSettled(feeds.map((feed) => refreshFeed(feed.id)));
}

async function updateFeedHealth(
    feedId: string,
    healthStatus: FeedHealthStatus,
    lastError: string | null,
    title?: string,
) {
    await prisma.feed.update({
        where: { id: feedId },
        data: {
            last_fetched_at: new Date(),
            health_status: healthStatus,
            last_error: lastError,
            ...(title != null && { title }),
        },
    });
}
