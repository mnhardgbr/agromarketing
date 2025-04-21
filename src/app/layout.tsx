import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgroMarket - Marketplace de Animais",
  description: "Compre e venda animais de forma segura e eficiente",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <Toaster />
            </div>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
