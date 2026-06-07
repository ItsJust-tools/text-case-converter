import { generateSeoMetadata } from '@/lib/seo';

export { generateSeoMetadata as generateMetadata } from '@/lib/seo';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var contrast = localStorage.getItem('contrast');
                  if (theme) document.documentElement.setAttribute('data-theme', theme);
                  if (contrast) document.documentElement.setAttribute('data-contrast', contrast);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}