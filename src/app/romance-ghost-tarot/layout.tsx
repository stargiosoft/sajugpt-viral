import TarotFontPreconnect from '@/components/tarot/TarotFontPreconnect';

export default function RomanceTarotLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TarotFontPreconnect />
      {children}
    </>
  );
}
