import { auth } from "@/app/(auth)/auth";

export default async function AppHomePage() {
    const session = await auth();

    return (
        <div>
            <h1>All items</h1>
            <p>Main feed — URL is /app</p>
            {session?.user ? (
                <p>
                    Signed in as {session.user.email ?? session.user.name ?? session.user.id}
                </p>
            ) : (
                <p>Not signed in</p>
            )}
        </div>
    );
}
