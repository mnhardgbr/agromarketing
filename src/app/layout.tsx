import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider';

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
      <body>
        <AuthProvider>
          <Providers>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
