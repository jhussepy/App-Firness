import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

// Custom web document (Expo Router convention). All in-app copy is Spanish,
// so we declare the page language explicitly and opt out of Chrome's
// auto-translate — with a mixed/undeclared language it was mangling short
// ambiguous strings (e.g. the day-strip letter "M" became "METRO").
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="es" className="notranslate" translate="no">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="google" content="notranslate" />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
