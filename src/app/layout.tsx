import SessionWrapper from "./SessionWrapper";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head><script src="/tailwindcdn.js"></script></head>
      <body>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}