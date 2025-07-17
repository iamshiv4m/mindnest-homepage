import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindNest - Supporting Children with Autism",
  description:
    "A comprehensive platform designed to support children with autism through interactive tools, social stories, and calming activities.",
  generator: "MindNest Team",
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
