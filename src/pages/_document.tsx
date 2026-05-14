import { cn } from "@/lib/utils";
import { Html, Head, Main, NextScript } from "next/document";
import { SEOElements } from "@/components/SEO";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <SEOElements />
        {/*
          CRITICAL: DO NOT REMOVE THIS SCRIPT
          The Softgen AI monitoring script is essential for core app functionality.
          The application will not function without it.
        */}
        <script
          src="https://cdn.softgen.ai/script.js"
          async
          data-softgen-monitoring="true"
        />
        
        {/* PWA Configuration */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Cleaning Chaos" />
        
        {/* App Icons */}
        <link rel="icon" href="/app-icon.png" />
        <link rel="apple-touch-icon" href="/app-icon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/app-icon-192.png" />
        
        {/* Theme Colors */}
        <meta name="theme-color" content="#00E5FF" />
        <meta name="msapplication-TileColor" content="#0F0F0F" />
        <meta name="msapplication-navbutton-color" content="#00E5FF" />
        
        {/* Splash Screens for iOS */}
        <meta name="apple-mobile-web-app-title" content="Cleaning Chaos" />
        <link rel="apple-touch-startup-image" href="/app-icon.png" />
      </Head>
      <body
        className={cn(
          "min-h-screen w-full scroll-smooth bg-background text-foreground antialiased"
        )}
      >
        <Main />
        <NextScript />

        {/* Visual Editor Script */}
        {process.env.NODE_ENV === "development" && (
          <script
            src="https://cdn.softgen.dev/visual-editor.min.js"
            async
            data-softgen-visual-editor="true"
          />
        )}
      </body>
    </Html>
  );
}
