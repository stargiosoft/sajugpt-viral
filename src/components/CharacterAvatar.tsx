interface Props {
  src: string;
  name: string;
  size?: number;
}

export default function CharacterAvatar({ src, name, size = 48 }: Props) {
  return (
    <div
      className="overflow-hidden transform-gpu"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.3)',
        flexShrink: 0,
      }}
    >
      <img
        src={src}
        alt={name}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}
