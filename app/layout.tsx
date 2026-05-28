import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Uni UI - University Uploaded Intelligence",
  description:
    "Built by a student in Owerri, for students across West Africa. Join the waitlist for a study organization platform designed specifically for engineering students.",
  keywords:
    "Uni UI, study platform, engineering students, FUTO, University of Nigeria, UNILAG, waitlist, study organization",
  authors: [{ name: "Uni UI Team" }],
  creator: "Uni UI",
  publisher: "Uni UI",
  metadataBase: new URL("https://waitlist.uniui.com.ng"),
  openGraph: {
    title: "Uni UI - Study Organization for Engineering Students",
    description:
      "A platform built by students, for students. Join the waitlist and get early access to smart study tools.",
    url: "https://waitlist.uniui.com.ng",
    siteName: "Uni UI",
    images: [
      {
        url: "/favicon.jpg",
        width: 1200,
        height: 630,
        alt: "Uni UI Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uni UI - Study Organization for Engineering Students",
    description:
      "A platform built by students, for students. Join the waitlist and get early access to smart study tools.",
    images: ["/favicon.jpg"],
  },
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/favicon.jpg" type="image/jpeg" />
        <meta name="theme-color" content="#0A0A0F" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://waitlist.uniui.com.ng" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Grotesk:wght@400;700&family=JetBrains+Mono&family=Caveat:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-body bg-background text-foreground min-h-screen overflow-x-hidden"
        style={{ backgroundColor: "#0A0A0F", color: "#FFFFFF" }}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#13131A",
              border: "1px solid rgba(212,175,55,0.3)",
              color: "#FFFFFF",
            },
          }}
        />
      </body>
    </html>
  );
}
