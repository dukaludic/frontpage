import { signOut } from "@/app/(auth)/actions";

export function SignOutButton() {
    return (
        <form action={signOut}>
            <button type="submit">Sign out</button>
        </form>
    );
}