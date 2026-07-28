import type { CSSProperties, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  radius?: number;
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  className?: string;
  style?: CSSProperties;
  stitch?: boolean;
  stitchInset?: number;
  stitchRadius?: number;
  stitchColor?: string;
  stitchWidth?: number;
  stitchDasharray?: string;
}

export default function DeangOutlineBox({
  children,
  radius = 16,
  strokeColor = 'rgb(162, 208, 185)',
  strokeWidth = 2.3,
  backgroundColor,
  className,
  style,
  stitch = false,
  stitchInset = 10,
  stitchRadius,
  stitchColor,
  stitchWidth = 1.9,
  stitchDasharray = '16 8',
}: Props) {
  return (
    <div
      className={className}
      style={{
        borderRadius: radius,
        border: `${strokeWidth}px solid ${strokeColor}`,
        backgroundColor,
        ...(stitch ? { position: 'relative', overflow: 'hidden' } : {}),
        ...style,
      }}
    >
      {stitch && (
        <svg
          aria-hidden
          style={{
            position: 'absolute',
            top: stitchInset,
            left: stitchInset,
            width: `calc(100% - ${stitchInset * 2}px)`,
            height: `calc(100% - ${stitchInset * 2}px)`,
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx={stitchRadius ?? Math.max(radius - stitchInset, 0)}
            ry={stitchRadius ?? Math.max(radius - stitchInset, 0)}
            fill="none"
            stroke={stitchColor ?? strokeColor}
            strokeWidth={stitchWidth}
            strokeDasharray={stitchDasharray}
            strokeLinecap="round"
          />
        </svg>
      )}
      {children}
    </div>
  );
}

interface DeangCardBoxProps {
  children: ReactNode;
  style?: CSSProperties;
  strokeWidth?: number;
}

export function DeangCardBox({ children, style, strokeWidth }: DeangCardBoxProps) {
  return (
    <DeangOutlineBox
      radius={20}
      strokeWidth={strokeWidth}
      backgroundColor="rgb(247, 250, 245)"
      stitch
      stitchColor="rgb(202, 230, 218)"
      style={style}
    >
      {children}
    </DeangOutlineBox>
  );
}

interface DeangStitchBadgeProps {
  children: ReactNode;
  radius?: number;
  style?: CSSProperties;
}

export function DeangStitchBadge({ children, radius = 16, style }: DeangStitchBadgeProps) {
  return (
    <DeangOutlineBox
      radius={radius}
      strokeWidth={0}
      backgroundColor="rgb(88, 184, 136)"
      stitch
      stitchInset={6}
      stitchRadius={12}
      stitchWidth={1.5}
      stitchColor="rgb(58, 148, 108)"
      stitchDasharray="8 5"
      style={style}
    >
      {children}
    </DeangOutlineBox>
  );
}
