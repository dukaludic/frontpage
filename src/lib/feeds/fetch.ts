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
        return null;
    } finally {
        clearTimeout(timeout);
    }
}
