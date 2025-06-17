
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from '@/components/layout/Navbar';
import { ApiProvider } from '@/contexts/ApiContext';
import { CartProvider } from '@/contexts/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SocketProvider } from '@/contexts/SocketContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cad & Cart",
  description: "E-commerce platform",
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased `}>
        <SocketProvider>
          <ThemeProvider>
            <ApiProvider>
              <CartProvider>
                <Navbar />
                {children}
              </CartProvider>
            </ApiProvider>
          </ThemeProvider>
        </SocketProvider>
      </body>
    </html>
  );
}