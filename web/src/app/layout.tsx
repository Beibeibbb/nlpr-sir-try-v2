import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/header";
import { AppTheme } from "@/components/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SIR · Smart Identity Recognition",
    template: "%s · SIR",
  },
  description:
    "Smart Identity Recognition group at NLPR and the State Key Laboratory of Multimodal Artificial Intelligence Systems, Institute of Automation, Chinese Academy of Sciences.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}>
        <AppTheme>
          <div className="bg-grid min-h-screen">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </div>
        </AppTheme>
      </body>
    </html>
  );
}
