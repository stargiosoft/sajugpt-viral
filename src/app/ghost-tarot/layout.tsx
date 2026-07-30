import TarotFontPreconnect from '@/components/tarot/TarotFontPreconnect';

export default function GhostTarotLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TarotFontPreconnect />
      {children}
    </>
  );
}
