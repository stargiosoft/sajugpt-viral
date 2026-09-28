'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

const COLORS = {
  primary: 'rgb(235 85 108)',
  primaryHover: 'rgb(220 70 95)',
  text: 'rgb(55 55 55)',
  textSecondary: 'rgb(100 100 100)',
  inputBg: 'rgb(250 250 250)',
  frameBg: 'rgb(255 248 249)',
  frameBorder: 'rgb(255 194 214)',
  placeholder: 'rgb(168 168 168)',
};

export default function BirthInput() {
  const router = useRouter();

  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('female');

  const isValidDate = useCallback((dateStr?: string): boolean => {
    if (typeof dateStr !== 'string' || !dateStr) {
      return false;
    }

    if (dateStr.length !== 10) {
      return false;
    }

    const [year, month, day] = dateStr.split('-').map(Number);

    if (!year || !month || !day) {
      return false;
    }

    if (
      year < 1900 ||
      year > 2100 ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      return false;
    }

    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidDate(birthDate)) {
      alert('올바른 생년월일을 입력해주세요.');
      return;
    }

    const params = new URLSearchParams({
      birthDate,
      birthTime,
      gender,
    });

    router.push(`/future-spouse/result?${params.toString()}`);
  };

  const isFormValid = isValidDate(birthDate);

  return (
    <div className="w-full max-w-110 mx-auto p-3 pb-10">
      <div
        style={{
          position: 'relative',
          backgroundColor: COLORS.frameBg,
          border: `2px solid ${COLORS.frameBorder}`,
          borderRadius: '24px',
          padding: '16px 12px',
          overflow: 'hidden',
        }}
      >
        {/* 배경 패턴 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/future-spouse/card-bg-hearts-result.webp)',
            backgroundSize: '140px auto',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
            opacity: 0.3,
          }}
        />

        {/* 상단 타이틀 카드 */}
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <div
            className="flex items-center justify-center gap-1.5 w-full bg-white rounded-[20px] px-3.5 py-4"
            style={{
              position: 'relative',
              border: `1.5px solid ${COLORS.frameBorder}`,
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '5px',
                borderRadius: '16px',
                border: '1.2px dashed #FFC2D6',
                pointerEvents: 'none',
              }}
            />

            <img
              src="/future-spouse/icon-heart.svg"
              alt=""
              className="w-3.5 h-3.5 -rotate-20"
            />

            <h2
              className="text-center text-[20px] font-semibold"
              style={{
                color: COLORS.primary,
                WebkitTextStroke: `0.2px ${COLORS.primary}`,
                letterSpacing: '-0.5px',
              }}
            >
              미래 배우자를 알아볼게요
            </h2>

            <img
              src="/future-spouse/icon-heart.svg"
              alt=""
              className="w-3.5 h-3.5 rotate-20"
            />
          </div>
        </div>

        {/* 폼 카드 */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-3">
          <div
            className="relative bg-white rounded-[20px] p-5"
            style={{
              border: `1.5px solid ${COLORS.frameBorder}`,
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '5px',
                borderRadius: '16px',
                border: '1.2px dashed #FFC2D6',
                pointerEvents: 'none',
              }}
            />

            <div className="relative z-10 space-y-4">
              <h3
                className="text-[15px] font-semibold mb-3"
                style={{ color: COLORS.primary }}
              >
                나의 정보
              </h3>

              {/* 성별 선택 */}
              <div>
                <label className="block text-[13px] font-medium text-[rgb(69,69,69)] mb-1.5">
                  성별
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[rgb(250,250,250)] p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`h-10 rounded-lg text-sm font-medium transition ${
                      gender === 'female'
                        ? 'bg-white text-[rgb(235,85,108)] shadow-sm font-semibold'
                        : 'text-[rgb(168,168,168)]'
                    }`}
                  >
                    여성
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`h-10 rounded-lg text-sm font-medium transition ${
                      gender === 'male'
                        ? 'bg-white text-[rgb(235,85,108)] shadow-sm font-semibold'
                        : 'text-[rgb(168,168,168)]'
                    }`}
                  >
                    남성
                  </button>
                </div>
              </div>

              {/* 생년월일 */}
              <div>
                <label
                  htmlFor="birthDate"
                  className="block text-[13px] font-medium text-[rgb(69,69,69)] mb-1.5"
                >
                  생년월일 (양력 기준)
                </label>
                <input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl text-sm outline-none transition"
                  style={{
                    backgroundColor: COLORS.inputBg,
                    color: COLORS.text,
                  }}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* 출생시간 */}
              <div>
                <label
                  htmlFor="birthTime"
                  className="block text-[13px] font-medium text-[rgb(69,69,69)] mb-1.5"
                >
                  태어난 시간
                </label>
                <input
                  id="birthTime"
                  type="time"
                  value={birthTime}
                  onChange={e => setBirthTime(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl text-sm outline-none transition"
                  style={{
                    backgroundColor: COLORS.inputBg,
                    color: COLORS.text,
                  }}
                />
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full h-13 rounded-2xl font-semibold text-[16px] transition active:scale-[0.98] mt-2"
            style={{
              backgroundColor: isFormValid ? COLORS.primary : '#EDEFF2',
              color: isFormValid ? '#FFFFFF' : COLORS.placeholder,
            }}
          >
            미래 배우자 확인하기
          </button>
        </form>
      </div>
    </div>
  );
}