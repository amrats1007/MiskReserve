import type { Metadata } from "next";
import { Tajawal, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "مِسك رُومز | MiskReserve - نظام حجز القاعات والتدريب",
  description: "نظام حجز القاعات والتدريب لشركة MiskTech - بديل سجل السكرتارية الورقي",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="antialiased selection:bg-cyan-500 selection:text-black">
        {/* Hardware-Accelerated Aurora Light */}
        <div className="aurora" aria-hidden="true" />
        
        {/* Hardware-Accelerated Ultra-Light Noise Overlay */}
        <div className="grain" aria-hidden="true" />

        <div className="relative z-10 min-h-screen">
          <ThemeProvider>
            <AuthProvider>
              <LanguageProvider>
                {children}
              </LanguageProvider>
            </AuthProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
