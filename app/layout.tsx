import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const baseUrl = new URL(
    host ? `${protocol}://${host}` : "https://repobloom-build-week.asta-aflc.chatgpt.site",
  );
  const socialImage = new URL("/og.png", baseUrl).toString();

  return {
    metadataBase: baseUrl,
    title: "Git --Profile Print — Grow from what you've already built",
    description:
      "An evidence-first learning coach that turns your GitHub history into a focused growth plan.",
    openGraph: {
      title: "Git --Profile Print",
      description: "Grow from what you've already built.",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "Git --Profile Print",
      description: "Grow from what you've already built.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
