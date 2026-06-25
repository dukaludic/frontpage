import { auth } from "@/app/(auth)/auth";
import { prisma } from "@/lib/db";
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

    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const feed = await prisma.$transaction(async (tx) => {
        const feed = await tx.feed.upsert({
            where: { url },
            create: {
                url,
                userFeeds: {
                    create: { userId },
                },
            },
            update: {},
        });

        await tx.userFeed.upsert({
            where: { userId_feedId: { userId, feedId: feed.id } },
            create: { userId, feedId: feed.id },
            update: {},
        });

        return tx.feed.findUniqueOrThrow({
            where: { id: feed.id },
            include: {
                feed_items: true,
                userFeeds: {
                    where: { userId },
                    include: {
                        user: true,
                        category: true,
                    },
                },
            },
        });
    });

    return NextResponse.json(feed);
}