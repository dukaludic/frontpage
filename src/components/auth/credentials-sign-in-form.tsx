"use client";

import { useActionState } from "react";
import { signInWithCredentials } from "@/app/(auth)/actions";

export default function CredentialsSignInForm() {
    const [state, formAction, pending] = useActionState(
        signInWithCredentials,
        null,
    );

    return (
        <form action={formAction}>
            {state?.error && <p role="alert">{state.error}</p>}
            <div>
                <label htmlFor="sign-in-email">Email</label>
                <input
                    id="sign-in-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                />
            </div>
            <div>
                <label htmlFor="sign-in-password">Password</label>
                <input
                    id="sign-in-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                />
            </div>
            <button type="submit" disabled={pending}>
                {pending ? "Signing in…" : "Sign in with email"}
            </button>
        </form>
    );
}
