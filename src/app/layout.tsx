import { QueryProvider } from '@/components/query-provider';
import { ConfirmDialogProvider } from '@/hooks/use-confirm-dialog';
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
  title: 'Plasmoid',
  description: 'Harness the power of productivity',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎯</text></svg>',
  },
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
          <ConfirmDialogProvider>
            {children}
            <Toaster />
          </ConfirmDialogProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
