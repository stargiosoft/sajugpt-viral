'use client';

import { useMemo } from 'react';
import BirthInput from './BirthInput';
import GenderSelect from './GenderSelect';
import TimeSelectSheet from './TimeSelectSheet';
import type { OhengFormState } from '@/types/oheng';

interface Props {
  form: OhengFormState;
  onChange: (patch: Partial<OhengFormState>) => void;
  onSubmit: () => void;
}

export default function InputForm({ form, onChange, onSubmit }: Props) {
  const isValid = useMemo(() => {
    return !!form.gender && /^\d{4}-\d{2}-\d{2}$/.test(form.birthday);
  }, [form]);

  return (
    <div style={{ padding: '32px 20px 40px', backgroundColor: '#F3E7C9' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#2B2013', textAlign: 'center' }}>
        사주 정보를 적어주시게
      </h1>
      <p style={{ fontSize: '13px', color: '#8A5A2B', textAlign: 'center', marginTop: '6px' }}>
        *정보는 저장되지 않습니다.
      </p>

      <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Field label="성별" checked={!!form.gender}>
          <GenderSelect value={form.gender} onChange={g => onChange({ gender: g })} />
        </Field>

        <Field label="생년월일">
          <BirthInput value={form.birthday} onChange={v => onChange({ birthday: v })} />
        </Field>

        <Field label="태어난 시간">
          <TimeSelectSheet
            value={form.birthTime}
            unknownTime={form.birthTimeUnknown}
            onSelect={(displayTime, isUnknown) => onChange({ birthTime: displayTime, birthTimeUnknown: isUnknown })}
          />
        </Field>
      </div>

      <button
        type="button"
        disabled={!isValid}
        onClick={onSubmit}
        style={{
          marginTop: '36px',
          width: '100%',
          height: '58px',
          borderRadius: '16px',
          backgroundColor: isValid ? '#2B2013' : '#C9BB98',
          color: '#F3E7C9',
          fontSize: '15px',
          fontWeight: 600,
          border: 'none',
          cursor: isValid ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.2s',
        }}
      >
        입력 완료
      </button>
    </div>
  );
}

function Field({ label, checked, children }: { label: string; checked?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
        <p style={{ fontSize: '13px', color: '#6B5B3A' }}>{label}</p>
        {checked && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#4C8C4A" />
            <path d="M7.5 12.5l3 3 6-6.5" stroke="#F3E7C9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {children}
    </div>
  );
}
