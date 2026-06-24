import { signInWithGithub } from "@/app/(auth)/actions";

type GithubAuthButtonProps = {
    label?: string;
};

export default function GithubAuthButton({
    label = "Sign in with GitHub",
}: GithubAuthButtonProps) {
    return (
        <form action={signInWithGithub}>
            <button type="submit">{label}</button>
        </form>
    );
}
