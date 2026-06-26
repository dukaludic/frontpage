import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      <h1 className="text-2xl font-bold text-center">Frontpage</h1>
      <p className="text-center text-gray-500">Your personalized front page for tech content.</p>
      <div className="flex gap-2 justify-center">
        <Link href="/sign-up">Sign Up</Link>
        <Link href="/sign-in">Sign In</Link>
        <Link href="/guest">Try as Guest</Link>
      </div>
    </main>
  );
}
