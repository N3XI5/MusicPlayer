import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YouTube Playlist App",
  description: "Stream your favorite YouTube playlists",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-black p-4 text-white">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              YouTube Playlist
            </Link>
            <div className="space-x-4">
              <Link href="/player" className="hover:text-gray-300">
                Player
              </Link>
              <Link href="/playlists" className="hover:text-gray-300">
                Playlists
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
