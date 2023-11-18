import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./components/Providers";
import { Header } from "./components/Header";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "zKGame",
  description:
    "zkGame front-end",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
