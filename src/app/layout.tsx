import type { Metadata } from "next";
import { GFS_Didot } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider'
import { ToasterProvider } from '@/components/toaster'
import { ClerkProviderWrapper } from '@/components/clerk-provider'

const gfsDidot = GFS_Didot({
  weight: "400",
  subsets: ["greek"],
  display: "swap",
  variable: "--font-didot",
});

export const metadata: Metadata = {
  title: "E-Governance Portal",
  description: "Modern e-governance web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProviderWrapper>
      <html lang="en" className={`${gfsDidot.variable} font-sans`} suppressHydrationWarning>
        <body className="min-h-screen antialiased" suppressHydrationWarning>
          <ThemeProvider>
            {children}
            <ToasterProvider />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}