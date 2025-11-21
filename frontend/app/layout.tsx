import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { NotificationProvider } from "@/context/notification-context";
import { GoogleIdentityScript } from "@/components/google-identity-script";
import { ChatWidget } from "@/components/chat-widget";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Corn Ecommerce",
  description: "Modern ecommerce experience",
};

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <NotificationProvider>
          <AuthProvider>
            {children}
            <ChatWidget />
          </AuthProvider>
          <GoogleIdentityScript clientId={googleClientId} />
        </NotificationProvider>
      </body>
    </html>
  );
}
