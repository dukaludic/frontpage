import CredentialsSignUpForm from "@/components/auth/credentials-sign-up-form";
import GithubAuthButton from "@/components/auth/github-sign-in-button";
import Link from "next/link";

export default function SignUpPage() {
    return (
        <div className="flex flex-col gap-2 items-center p-4 border border-gray-200 rounded-md max-w-md mx-auto mt-4">
            <h1 className="text-2xl font-bold text-center">Sign up</h1>
            <CredentialsSignUpForm />
            <p>or</p>
            <GithubAuthButton />
            <br />
        </div>
    );
}
