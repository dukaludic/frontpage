import CredentialsSignInForm from "@/components/auth/credentials-sign-in-form";
import GithubAuthButton from "@/components/auth/login-button";
import Link from "next/link";

export default function SignInPage() {
    return (
        <div>
            <h1>Sign in</h1>
            <CredentialsSignInForm />
            <p>or</p>
            <GithubAuthButton />
            <br />
            <Link href="/sign-up">Sign up</Link>
        </div>
    );
}
