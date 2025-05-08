import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acadally",
  description: "Acadally Web Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.matchMedia('(display-mode: standalone)').matches) {
                document.documentElement.style.display = 'block';
                document.body.style.display = 'block';
              }
              
              if ('standalone' in window.navigator) {
                if (window.navigator.standalone) {
                  document.documentElement.style.display = 'block';
                  document.body.style.display = 'block';
                }
              }
            `
          }}
        />
        {children}
      </body>
    </html>
  );
}
