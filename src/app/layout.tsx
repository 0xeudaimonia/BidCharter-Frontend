import { Inter } from "next/font/google";
import App from "@/src/components/App";
import { Toaster } from "@/src/components/ui/sonner";
import "@/src/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <App>
          <main>{children}</main>
          <Toaster />
        </App>
      </body>
    </html>
  );
}
