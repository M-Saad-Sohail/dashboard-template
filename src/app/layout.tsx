import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ReduxProvider from '@/_core/providers/ReduxProvider';
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ReduxProvider>
          <ThemeProvider>
            <SidebarProvider>
              {children}
              <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                  // Default options
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  // Success
                  success: {
                    duration: 3000,
                    style: {
                      background: '#10b981',
                      color: '#fff',
                    },
                    iconTheme: {
                      primary: '#fff',
                      secondary: '#10b981',
                    },
                  },
                  // Error
                  error: {
                    duration: 4000,
                    style: {
                      background: '#ef4444',
                      color: '#fff',
                    },
                    iconTheme: {
                      primary: '#fff',
                      secondary: '#ef4444',
                    },
                  },
                }}
              />
            </SidebarProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
