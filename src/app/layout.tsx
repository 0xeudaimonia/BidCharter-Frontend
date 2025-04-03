import { Inter } from "next/font/google";
import "./globals.css";
import App from "../../components/App";
import { Toaster } from "../../components/ui/sonner";

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
