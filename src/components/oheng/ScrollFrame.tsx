export default function ScrollFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
        <RollerKnob />
        <RollerKnob />
      </div>
      <div
        style={{
          height: '14px',
          borderRadius: '7px',
          background: 'linear-gradient(180deg, #B98A4D 0%, #8A5A2B 100%)',
          border: '1.5px solid #2B2013',
        }}
      />
      <div
        style={{
          backgroundColor: '#FBF3E1',
          border: '1.5px solid #2B2013',
          borderTop: 'none',
          borderBottom: 'none',
          padding: '28px 24px',
          boxShadow: 'inset 0 0 30px rgba(138,90,43,0.08)',
        }}
      >
        {children}
      </div>
      <div
        style={{
          height: '14px',
          borderRadius: '7px',
          background: 'linear-gradient(180deg, #8A5A2B 0%, #B98A4D 100%)',
          border: '1.5px solid #2B2013',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
        <RollerKnob />
        <RollerKnob />
      </div>
    </div>
  );
}

function RollerKnob() {
  return (
    <div
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#B98A4D',
        border: '1.5px solid #2B2013',
        marginTop: '-3px',
      }}
    />
  );
}
