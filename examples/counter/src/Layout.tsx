interface LayoutProps {
  children: JSX.Element;
}

export function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <html>
      <head>
        <title>Counter</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
