import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      <h1>Frontpage</h1>
      <p>Your personalized front page for tech content.</p>
      <Link href="/sign-up">Sign Up</Link>
      <Link href="/guest">Try as Guest</Link>
    </main>
  );
}
