export default function TriangleIcon({ color, up, size = 13 }: { color: string; up: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: 'inline-block', flexShrink: 0, transform: up ? 'rotate(180deg)' : undefined }}
    >
      <path
        fill={color}
        d="M4.88891 7C4.52939 7 4.20527 7.24364 4.06769 7.61732C3.93011 7.99099 4.00616 8.42111 4.26037 8.70711L11.3715 16.7071C11.7186 17.0976 12.2814 17.0976 12.6285 16.7071L19.7396 8.70711C19.9938 8.42111 20.0699 7.99099 19.9323 7.61732C19.7947 7.24364 19.4706 7 19.1111 7H4.88891Z"
      />
    </svg>
  );
}
