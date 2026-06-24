"use client";

import { useActionState } from "react";
import { registerWithCredentials } from "@/app/(auth)/actions";

export default function CredentialsSignUpForm() {
    const [state, formAction, pending] = useActionState(
        registerWithCredentials,
        null,
    );

    return (
        <form action={formAction}>
            {state?.error && <p role="alert">{state.error}</p>}
            <div>
                <label htmlFor="sign-up-email">Email</label>
                <input
                    id="sign-up-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                />
            </div>
            <div>
                <label htmlFor="sign-up-password">Password</label>
                <input
                    id="sign-up-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                />
            </div>
            <button type="submit" disabled={pending}>
                {pending ? "Creating account…" : "Sign up with email"}
            </button>
        </form>
    );
}
