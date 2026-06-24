import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type JwtCallbackParams = {
    token: JWT;
    user?: User;
};

type SessionCallbackParams = {
    session: Session;
    token: JWT;
};

export const authCallbacks = {
    async jwt({ token, user }: JwtCallbackParams) {
        if (user) {
            token.id = user.id;
        }
        return token;
    },
    async session({ session, token }: SessionCallbackParams) {
        if (session.user && typeof token.id === "string") {
            session.user.id = token.id;
        }
        return session;
    },
};
