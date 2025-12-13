import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

// The root layout must contain html and body tags
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
       <body className={`${inter.className} bg-slate-50 min-h-screen`}>
        {children}
       </body>
    </html>
  );
}