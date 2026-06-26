"use client";

import { useActionState } from "react";
import { registerWithCredentials } from "@/app/(auth)/actions";

export default function CredentialsSignUpForm() {
    const [state, formAction, pending] = useActionState(
        registerWithCredentials,
        null,
    );

    return (
        <form className="flex flex-col gap-2" role="form" action={formAction}>
            {state?.error && <p role="alert" className="text-red-500" aria-live="polite">{state.error}</p>}
            <div className="flex flex-col gap-2 items-center">
                <label htmlFor="sign-up-email" className="text-sm font-medium">Email</label>
                <input
                    className="w-full p-2 border border-gray-200 rounded-md"
                    id="sign-up-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                />
            </div>
            <div className="flex flex-col gap-2 items-center">
                <label htmlFor="sign-up-password" className="text-sm font-medium">Password</label>
                <input
                    className="w-full p-2 border border-gray-200 rounded-md"
                    id="sign-up-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                />
            </div>
            <div className="flex justify-center">
                <button type="submit" disabled={pending} className="text-center cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md">
                    {pending ? "Creating account…" : "Sign up with email"}
                </button>
            </div>
        </form>
    );
}
