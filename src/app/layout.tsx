import type { Metadata } from "next";
import { Tajawal, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

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
        {/* Desktop Commander Aurora Radial Lighting */}
        <div className="aurora" aria-hidden="true" />
        
        {/* Desktop Commander Film Grain Overlay */}
        <svg className="grain" width="100%" height="100%" aria-hidden="true">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" opacity="0.18" />
        </svg>

        <div className="relative z-10 min-h-screen">
          <AuthProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}

