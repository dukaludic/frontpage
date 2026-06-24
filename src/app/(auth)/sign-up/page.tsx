import CredentialsSignUpForm from "@/components/auth/credentials-sign-up-form";
import GithubAuthButton from "@/components/auth/login-button";
import Link from "next/link";

export default function SignUpPage() {
    return (
        <div>
            <h1>Sign up</h1>
            <CredentialsSignUpForm />
            <p>or</p>
            <GithubAuthButton label="Sign up with GitHub" />
            <br />
            <Link href="/sign-in">Sign in</Link>
        </div>
    );
}
