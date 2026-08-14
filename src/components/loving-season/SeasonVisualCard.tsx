'use client';

interface Props {
  firstSeason: string;
  allSeasons: string[];
}

export function SeasonVisualCard({
  firstSeason,
  allSeasons,
}: Props) {
  return (
    <div
      style={{
        fontFamily:
          "'Courier New', monospace",
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '48px',
          marginBottom: '10px',
        }}
      >
      </div>

      <div
        style={{
          fontSize: '10px',
          color: '#596149',
          marginBottom: '8px',
        }}
      >
        NEXT LOVE EVENT
      </div>

      <div
        style={{
          fontSize: '24px',
          fontWeight: 900,
          color: '#30372A',
        }}
      >
        {firstSeason}
      </div>

      {allSeasons.length > 1 && (
        <div
          style={{
            marginTop: '12px',
            fontSize: '10px',
            color: '#596149',
          }}
        >
          + {allSeasons.length - 1}
          개의 가능 시기
        </div>
      )}
    </div>
  );
}