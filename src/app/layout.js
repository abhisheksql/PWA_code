import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="/service-worker.js"
          strategy="blocking"
          onReady={() => {
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js').then(
                  (registration) => {
                    console.log('ServiceWorker registration successful');
                  },
                  (err) => {
                    console.log('ServiceWorker registration failed: ', err);
                  }
                );
              });
            }
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}