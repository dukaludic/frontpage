"use server";

import { AuthError } from "@/lib/auth/errors";
import { signIn } from "./auth";
import { prisma } from "@/lib/db";
import {
    type AuthActionState,
    credentialsSchema,
} from "@/lib/auth/credentials";
import { hashPassword } from "@/lib/auth/password";

const redirectTo = "/app";

export async function signInWithGithub() {
    await signIn("github", { redirectTo });
}

export async function signInWithCredentials(
    _prevState: AuthActionState,
    formData: FormData,
): Promise<AuthActionState> {
    const parsed = credentialsSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid credentials" };
    }

    try {
        await signIn("credentials", {
            ...parsed.data,
            redirectTo,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Invalid email or password" };
        }
        throw error;
    }

    return null;
}

export async function registerWithCredentials(
    _prevState: AuthActionState,
    formData: FormData,
): Promise<AuthActionState> {
    const parsed = credentialsSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const existing = await prisma.user.findUnique({
        where: { email: parsed.data.email },
    });

    if (existing) {
        return { error: "An account with this email already exists" };
    }

    const passwordHash = await hashPassword(parsed.data.password);

    await prisma.user.create({
        data: {
            email: parsed.data.email,
            password: passwordHash,
        },
    });

    try {
        await signIn("credentials", {
            ...parsed.data,
            redirectTo,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Account created but sign-in failed. Try signing in." };
        }
        throw error;
    }

    return null;
}
