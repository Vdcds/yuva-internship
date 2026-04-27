import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider'
import { ToasterProvider } from '@/components/toaster'
import { ClerkProviderWrapper } from '@/components/clerk-provider'

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
      <ThemeProvider>
        <html lang="en" className="font-sans" suppressHydrationWarning>
          <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=GFS+Didot&display=swap" rel="stylesheet" />
          </head>
          <body className="min-h-screen antialiased" suppressHydrationWarning>
            {children}
            <ToasterProvider />
          </body>
        </html>
      </ThemeProvider>
    </ClerkProviderWrapper>
  );
}