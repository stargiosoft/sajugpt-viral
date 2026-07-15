export default function RomanceTarotLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=East+Sea+Dokdo&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
