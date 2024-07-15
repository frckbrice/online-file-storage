import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConvexClientProvider from "./ConvexClientProvider";
import Header from "@/components/features/header";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  metadataBase:
    process.env.NODE_ENV === "development"
      ? new URL(`https://localhost:${process.env.PORT || 3000}`)
      : new URL(
        `https://online-files-storage-vercel.app/${process.env.PORT || 3000}`,
      ),
  title: {
    default: "online-files-storage ",
    template: "%s - digital ",
    absolute: "online-files-storage ",
  },
  description:
    "digital place to store my files in the cloud",
  twitter: {
    card: "summary_large_image", //this is to show our opengraph image to tweeter
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <Header />
          {children}
          <Toaster
            richColors
            theme="light"
            closeButton
            position="bottom-right"
          />
        </ConvexClientProvider>
      </body>
    </html>
  );
}