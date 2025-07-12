
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Chatbot } from '@/components/chatbot/Chatbot';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: 'HomeCalc Pro | Plan Any Home Project with Free, Easy-to-Use Calculators',
    template: '%s | HomeCalc Pro',
  },
  description: 'Get instant, accurate estimates for any home project with HomeCalc Pro\'s suite of free online calculators. Perfect for DIY, HVAC, painting, flooring, and more. Plan your budget and save money.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
