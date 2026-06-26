"use client";

import { useActionState } from "react";
import { signInWithCredentials } from "@/app/(auth)/actions";

export default function CredentialsSignInForm() {
    const [state, formAction, pending] = useActionState(
        signInWithCredentials,
        null,
    );

    return (
        <form className="flex flex-col gap-2" action={formAction}>
            {state?.error && <p role="alert" className="text-red-500">{state.error}</p>}

            <div className="flex flex-col gap-2 items-center">
                <label htmlFor="sign-in-email">Email</label>
                <input
                    id="sign-in-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                />
            </div>
            <div className="flex flex-col gap-2 items-center">
                <label htmlFor="sign-in-password">Password</label>
                <input
                    id="sign-in-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                />
            </div>
            <div className="flex justify-center">
                <button type="submit" disabled={pending} className="text-center cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md">
                    {pending ? "Signing in…" : "Sign in with email"}
                </button>
            </div>
        </form>
    );
}
