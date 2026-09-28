'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import FieldLabel from '@/components/FieldLabel';
import PressableButton from '@/components/PressableButton';
import GenderHeartIcon from '@/components/GenderHeartIcon';

interface FormState {
  gender: 'male' | 'female' | null;
  birthday: string;
  birthTime: string;
  birthTimeUnknown: boolean;
}

const COLORS = {
  primary: 'rgb(190, 93, 116)',
  primaryHover: 'rgb(169, 73, 96)',
  gold: 'rgb(190, 148, 82)',
  goldLight: 'rgb(239, 221, 184)',
  text: 'rgb(58, 51, 52)',
  textSecondary: 'rgb(112, 102, 104)',
  textTertiary: 'rgb(157, 148, 150)',
  inputBg: 'rgb(255, 252, 249)',
  frameBg: 'linear-gradient(145deg, rgb(255, 249, 246) 0%, rgb(255, 245, 248) 100%)',
  frameBorder: 'rgb(225, 190, 164)',
  textOnPrimary: '#FFFFFF',
  placeholder: 'rgb(170, 162, 163)',
};

const NEUTRAL_GRAY = 'rgb(190, 184, 185)';

const FADE_UP = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

function isValidPerson(person: FormState) {
  return (
    !!person.gender &&
    /^\d{4}-\d{2}-\d{2}$/.test(person.birthday) &&
    (person.birthTimeUnknown || !!person.birthTime)
  );
}

export default function FutureSpouseClient() {
  const [form, setForm] = useState<FormState>({
    gender: null,
    birthday: '',
    birthTime: '',
    birthTimeUnknown: false,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isValid = useMemo(() => isValidPerson(form), [form]);

  const updateForm = (patch: Partial<FormState>) => {
    setForm(prev => ({ ...prev, ...patch }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = () => {
    if (!isValid || !form.gender) {
      setErrorMessage('성별, 생년월일, 태어난 시간을 모두 입력해주세요.');
      return;
    }

    const params = new URLSearchParams({
      birthday: form.birthday,
      gender: form.gender,
      birthTime: form.birthTime,
      birthTimeUnknown: String(form.birthTimeUnknown),
    });

    window.location.href = `/future-spouse/result?${params.toString()}`;
  };

  return (
    <>
      <style jsx global>{`
        @font-face {
            font-family: 'PyeongchangPeace';
            src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2206-02@1.0/PyeongChangPeace-Bold.woff2') format('woff2');
            font-weight: 700;
            font-display: swap;
        }

        .future-spouse-container, 
        .future-spouse-container * {
            font-family: 'PyeongchangPeace', sans-serif !important;
            font-weight: 700 !important; /* 모든 텍스트 볼드 처리로 선명하게 고정 */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-110 mx-auto future-spouse-container"
        style={{ padding: '14px 14px 48px' }}
      >
        {/* OUTER FRAME */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: COLORS.frameBg,
            border: `1px solid ${COLORS.frameBorder}`,
            borderRadius: '30px',
            padding: '12px',
            boxShadow: '0 14px 40px rgba(153, 90, 99, 0.10), inset 0 0 0 1px rgba(255,255,255,0.7)',
          }}
        >
          {/* BACKGROUND DECORATION */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/future-spouse/card-bg-hearts-result.webp)',
              backgroundSize: '150px auto',
              backgroundPosition: 'center',
              backgroundRepeat: 'repeat',
              opacity: 0.10,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '220px',
              height: '220px',
              top: '-120px',
              right: '-70px',
              borderRadius: '999px',
              background: 'radial-gradient(circle, rgba(239,221,184,0.38) 0%, rgba(239,221,184,0) 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              bottom: '-100px',
              left: '-70px',
              borderRadius: '999px',
              background: 'radial-gradient(circle, rgba(235,185,198,0.28) 0%, rgba(235,185,198,0) 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* CONTENT */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* HERO */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              style={{ position: 'relative', marginBottom: '12px' }}
            >
              <div
                style={{
                  position: 'relative',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,251,248,0.94) 100%)',
                  borderRadius: '24px',
                  border: '1px solid rgba(225,190,164,0.85)',
                  padding: '26px 18px 24px',
                  textAlign: 'center',
                  boxShadow: '0 5px 18px rgba(147, 88, 96, 0.06)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: '6px',
                    borderRadius: '19px',
                    border: '1px solid rgba(239,221,184,0.72)',
                    pointerEvents: 'none',
                  }}
                />
                <h2
                  style={{
                    position: 'relative',
                    margin: 0,
                    color: COLORS.text,
                    fontSize: '25px',
                    lineHeight: 1.35,
                    letterSpacing: '-1.1px',
                  }}
                >
                  나의 미래 배우자는?
                </h2>
                <p
                  style={{
                    position: 'relative',
                    margin: '9px 0 0',
                    color: COLORS.textSecondary,
                    fontSize: '13px',
                    lineHeight: 1.65,
                    letterSpacing: '-0.35px',
                  }}
                >
                  아직 만나지 않은 그 사람을
                  <br />
                  사주로 미리 알아보세요.
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '16px',
                    color: COLORS.gold,
                  }}
                >
                  <span style={{ width: '34px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(190,148,82,0.6))' }} />
                  <span style={{ fontSize: '12px' }}>♡</span>
                  <span style={{ width: '34px', height: '1px', background: 'linear-gradient(90deg, rgba(190,148,82,0.6), transparent)' }} />
                </div>
              </div>
            </motion.div>

            {/* FORM CARD */}
            <motion.div
              className="flex flex-col"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.08 } },
              }}
            >
              <motion.div variants={FADE_UP as any}>
                <div
                  style={{
                    position: 'relative',
                    background: 'rgba(255,255,255,0.94)',
                    borderRadius: '24px',
                    border: '1px solid rgba(225,190,164,0.72)',
                    padding: '22px 18px 20px',
                    boxShadow: '0 5px 18px rgba(147, 88, 96, 0.055)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: '6px',
                      borderRadius: '19px',
                      border: '1px solid rgba(239,221,184,0.55)',
                      pointerEvents: 'none',
                    }}
                  />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* FORM TITLE */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '30px',
                          height: '30px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, rgb(250,235,226), rgb(247,222,230))',
                          color: COLORS.primary,
                          fontSize: '15px',
                        }}
                      >
                        💍
                      </div>
                      <div>
                        <div style={{ color: COLORS.text, fontSize: '15px', letterSpacing: '-0.45px' }}>
                          나의 사주 정보를 입력해주세요
                        </div>
                      </div>
                    </div>

                    {/* GENDER */}
                    <div className="flex flex-col w-full">
                      <FieldLabel color={COLORS.textSecondary} fontSize="12px" marginBottom="7px">
                        성별
                      </FieldLabel>
                      <GenderSelect
                        groupId="future-spouse"
                        value={form.gender}
                        onChange={gender => updateForm({ gender })}
                        accentColor={COLORS.primary}
                        bgColor={COLORS.inputBg}
                        fontSize="15px"
                        height="46px"
                        unselectedColor={NEUTRAL_GRAY}
                        border="1px solid rgb(235, 227, 225)"
                        indicatorBoxShadow="none"
                        textStrokeWidth="0.2px"
                        icon={selected => (
                          <GenderHeartIcon filled={selected} unselectedColor={NEUTRAL_GRAY} />
                        )}
                      />
                    </div>

                    {/* BIRTHDAY */}
                    <div className="flex flex-col w-full" style={{ marginTop: '16px' }}>
                      <FieldLabel color={COLORS.textSecondary} fontSize="12px" marginBottom="7px">
                        생년월일
                      </FieldLabel>
                      <BirthInput
                        value={form.birthday}
                        onChange={birthday => updateForm({ birthday })}
                        accentColor={COLORS.primary}
                        bgColor={COLORS.inputBg}
                        borderColor="rgb(235, 227, 225)"
                        textColor={COLORS.text}
                        fontSize="15px"
                        height="53px"
                        onEnter={handleSubmit}
                        autoFocus={false}
                        textStrokeWidth="0px"
                      />
                    </div>

                    {/* BIRTH TIME */}
                    <div className="flex flex-col w-full" style={{ marginTop: '16px' }}>
                      <FieldLabel color={COLORS.textSecondary} fontSize="12px" marginBottom="7px">
                        태어난 시간
                      </FieldLabel>
                      <TimeSelectSheet
                        value={form.birthTime}
                        unknownTime={form.birthTimeUnknown}
                        onSelect={(displayTime, unknown) =>
                          updateForm({
                            birthTime: displayTime,
                            birthTimeUnknown: unknown,
                          })
                        }
                        accentColor={COLORS.primary}
                        bgColor={COLORS.inputBg}
                        borderColor="rgb(235, 227, 225)"
                        textColor={COLORS.text}
                        placeholderColor={COLORS.textTertiary}
                        sheetBgColor="#FFFFFF"
                        sheetTextColor="#000000"
                        dragHandleColor="rgb(220, 215, 214)"
                        hoverBgClass="hover:bg-black/[0.03]"
                        selectedBgColor="rgb(250, 236, 239)"
                        selectedTextColor={COLORS.primary}
                        fontSize="15px"
                        height="53px"
                        arrowColor={NEUTRAL_GRAY}
                        textStrokeWidth="0px"
                        sheetTitleFontSize="20px"
                        sheetTitleLetterSpacing="-0.8px"
                        sheetTitlePaddingBottom="2px"
                      />
                    </div>

                    {/* NOTICE */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '14px',
                        padding: '9px 11px',
                        borderRadius: '10px',
                        background: 'rgb(255,249,246)',
                        color: COLORS.textTertiary,
                        fontSize: '10.5px',
                        lineHeight: 1.5,
                        letterSpacing: '-0.25px',
                      }}
                    >
                      <span style={{ marginRight: '6px', color: COLORS.gold }}>✦</span>
                      태어난 시간이 정확하지 않아도 분석할 수 있어요.
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ERROR */}
              {errorMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontSize: '12px',
                    color: 'rgb(214, 74, 91)',
                    textAlign: 'center',
                    marginTop: '9px',
                    marginBottom: '0',
                    letterSpacing: '-0.2px',
                  }}
                >
                  {errorMessage}
                </motion.p>
              )}

              {/* SUBMIT BUTTON */}
              <motion.div variants={FADE_UP as any} style={{ marginTop: '12px' }}>
                <PressableButton
                  onClick={handleSubmit}
                  disabled={!isValid}
                  label=" 내 미래 배우자 미리보기"
                  style={{ height: '56px' }}
                  bgStyle={{
                    backgroundColor: isValid ? COLORS.primary : 'rgb(238, 236, 236)',
                    borderRadius: '17px',
                    boxShadow: isValid
                      ? '0 7px 18px rgba(177,78,101,0.24)'
                      : 'none',
                  }}
                  hoverBackground={COLORS.primaryHover}
                  textStyle={{
                    color: isValid ? COLORS.textOnPrimary : 'rgb(160, 157, 157)',
                    fontSize: '15px',
                    letterSpacing: '-0.3px',
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}