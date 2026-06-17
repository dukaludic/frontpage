import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frontpage",
  description: "Your personalized front page for tech content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
