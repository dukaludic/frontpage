import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { credentialsSchema } from "@/lib/auth/credentials";
import { verifyPassword } from "@/lib/auth/password";
import { authCallbacks } from "@/lib/auth/session-callbacks";

if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET must be set");
}

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    throw new Error("GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be set");
}

const credentialsProvider = Credentials({
    credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
            return null;
        }

        const user = await prisma.user.findUnique({
            where: { email: parsed.data.email },
        });

        if (!user?.password) {
            return null;
        }

        const valid = await verifyPassword(
            parsed.data.password,
            user.password,
        );

        if (!valid) {
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
        };
    },
}) satisfies Provider;

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        credentialsProvider,
    ],
    callbacks: authCallbacks,
});
