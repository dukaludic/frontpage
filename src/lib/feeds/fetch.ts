import { FetchResult } from "./types";

export async function fetchFeed(url: string): Promise<FetchResult> {
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
            return {
                ok: false,
                kind: "http",
                status: response.status,
                message: `HTTP error! status: ${response.status}`,
            };
        }

        const body = await response.text();
        return { ok: true, body };
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            return {
                ok: false,
                kind: "timeout",
                message: "Request timed out after 10s",
            };
        }

        const message =
            error instanceof Error ? error.message : "Network request failed";
        return { ok: false, kind: "network", message };
    } finally {
        clearTimeout(timeout);
    }
}
