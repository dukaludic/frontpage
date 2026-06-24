import { fetchFeed } from "@/lib/feeds/fetch";
import { parseFeed } from "@/lib/feeds/parser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let body: { url?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const url = body.url?.trim();
    if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const fetched = await fetchFeed(url);

    if (!fetched.ok) {
        return NextResponse.json(
            { error: fetched.message },
            { status: fetched.kind === "http" ? 400 : 502 },
        );
    }

    const feed = await parseFeed(fetched.body);

    if (!feed) {
        return NextResponse.json(
            { error: "Failed to parse feed" },
            { status: 400 },
        );
    }

    return NextResponse.json({
        title: feed.feed.title,
        url: feed.feed.url,
        sampleItems: feed.items.slice(0, 5),
    });
}
