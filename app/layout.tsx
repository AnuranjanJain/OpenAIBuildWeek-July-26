import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoBloom — Grow from what you've built",
  description:
    "An evidence-first learning coach that turns your GitHub history into a focused growth plan.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
