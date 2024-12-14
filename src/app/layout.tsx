import { QueryProvider } from '@/components/query-provider';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from 'sonner';
import './globals.css';

const inter = localFont({
  src: './fonts/Inter.woff2',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PLASMOID',
  description: 'Harness the power of productivity',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={cn(inter.className, 'antialiased min-h-screen')}>
        <QueryProvider>
          <Toaster />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
