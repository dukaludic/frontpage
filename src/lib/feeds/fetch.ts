import { prisma } from "../db";
import { FeedHealthStatus } from "./types";

export async function fetchFeed(url: string): Promise<string | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort();
    }, 10000);

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                "User-Agent": "Frontpage/0.1 (+https://not-made-yet.com; dev build)",
                "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();

        return text;
    } catch (error) {
        console.error(error);

        if (error instanceof Error && error.message.includes('404')) {
            await prisma.feed.update({
                where: { url: url },
                data: {
                    last_fetched_at: new Date(),
                    health_status: FeedHealthStatus.Unreachable,
                    last_error: error.message,
                },
            });
            return null;
        }

        if (error instanceof Error && error.message.includes('HTML')) {
            await prisma.feed.update({
                where: { url: url },
                data: {
                    health_status: "Invalid",
                },
            });
            return null;
        }
        return null;
    } finally {
        clearTimeout(timeout);
    }
}
