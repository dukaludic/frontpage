import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Session } from "@auth/core/types";
import { auth } from "@/app/(auth)/auth";

type AuthProxyRequest = NextRequest & { auth: Session | null };

const publicRoutes = ["/", "/guest"];

function isPublicRoute(pathname: string) {
    return publicRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
}

export default auth((req: AuthProxyRequest) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    const isAppRoute =
        pathname === "/app" || pathname.startsWith("/app/");
    const isAuthRoute =
        pathname.startsWith("/sign-in") ||
        pathname.startsWith("/sign-up") ||
        pathname.startsWith("/reset-password");

    if (isAppRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/app", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
