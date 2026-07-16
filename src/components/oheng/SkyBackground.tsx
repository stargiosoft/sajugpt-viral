export default function SkyBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, #BFE0EA 0%, #D8E9D4 100%)',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <Cloud top="8%" left="10%" scale={1} />
      <Cloud top="16%" left="68%" scale={0.8} />
      <Cloud top="4%" left="42%" scale={0.6} />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '18%',
          background: 'linear-gradient(180deg, rgba(216,233,212,0) 0%, #C9DFC2 100%)',
        }}
      />
    </div>
  );
}

function Cloud({ top, left, scale }: { top: string; left: string; scale: number }) {
  return (
    <svg
      width={90 * scale}
      height={40 * scale}
      viewBox="0 0 90 40"
      style={{ position: 'absolute', top, left, opacity: 0.9 }}
    >
      <ellipse cx="25" cy="26" rx="22" ry="14" fill="#FFFFFF" />
      <ellipse cx="50" cy="18" rx="24" ry="16" fill="#FFFFFF" />
      <ellipse cx="70" cy="26" rx="18" ry="12" fill="#FFFFFF" />
    </svg>
  );
}
