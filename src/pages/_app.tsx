import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { CleaningProvider } from '@/contexts/CleaningProvider';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/next';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Request notification permission for cleaning reminders
    if ('Notification' in window && Notification.permission === 'default') {
      // Don't auto-request, wait for user action
      // Notification.requestPermission();
    }
  }, []);

  return (
    <CleaningProvider>
      <Component {...pageProps} />
      <Toaster />
      <Analytics />
    </CleaningProvider>
  );
}