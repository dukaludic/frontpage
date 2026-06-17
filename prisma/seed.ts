console.log("Seeding database...");

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    const hn = await prisma.feed.upsert({
        where: { url: "https://hnrss.org/frontpage" },
        update: {},
        create: {
            url: "https://hnrss.org/frontpage",
            name: "Hacker News",
            feed_items: {
                create: [
                    {
                        url: "https://example.com/post-1",
                        title: "Seed item one",
                        description: "Placeholder for local dev",
                        published_at: new Date(),
                    },
                ],
            },
        },
    });

    console.log(`Seeded feed: ${hn.name}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());