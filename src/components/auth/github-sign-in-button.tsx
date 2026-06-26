import { signInWithGithub } from "@/app/(auth)/actions";

type GithubAuthButtonProps = {
    label?: string;
};

export default function GithubAuthButton({
    label = "Sign in with GitHub",
}: GithubAuthButtonProps) {
    return (
        <form action={signInWithGithub}>
            <button type="submit" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md">{label}</button>
        </form>
    );
}
