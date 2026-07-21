import Image from 'next/image';
import { motion } from 'framer-motion';
import type { DeangProfileData, DeangStats } from '@/types/deang-saju';
import DeangOutlineBox from './DeangOutlineBox';
import useIsNarrow from '@/hooks/useIsNarrow';

interface Section {
  title: string;
  body: string;
}

interface Props {
  profile: DeangProfileData;
}

const STAT_LABELS: Record<keyof DeangStats, string> = {
  leadership: '리더십',
  affection: '애교',
  perceptiveness: '눈치',
  independence: '독립성',
  attachment: '집착',
};

export default function DeangResultContent({ profile }: Props) {
  const isNarrow = useIsNarrow();
  const { breed, stats, bestMatch, worstMatch } = profile;
  const statEntries = Object.entries(stats) as [keyof DeangStats, number][];

  const sections: Section[] = [
    { title: '타고난 기질 & 성격', body: breed.temperament },
    { title: '감정 표현 방식 & 인간관계', body: breed.socialStyle },
    { title: '연애 스타일', body: breed.loveStyle },
    { title: '직장 스타일', body: breed.workStyle },
  ];

  return (
    <div className="flex flex-col" style={{ gap: '8px', marginTop: '8px' }}>
      <DeangOutlineBox
        radius={20}
        backgroundColor="rgb(247, 250, 245)"
        stitch
        stitchColor="rgb(202, 230, 218)"
        style={{
          padding: '36px 36px 40px',
        }}
      >
        <p style={{ fontFamily: 'Cafe24 Dongdong, sans-serif', fontSize: '23px', letterSpacing: '-0.5px', color: '#000000', WebkitTextStroke: '0.6px #000000', marginBottom: '18px' }}>
          댕댕 능력치
        </p>
        <div className="flex flex-col" style={{ gap: '14px' }}>
          {statEntries.map(([key, value]) => (
            <div key={key} className="flex items-center" style={{ gap: '10px' }}>
              <span style={{ width: '54px', flexShrink: 0, whiteSpace: 'nowrap', fontFamily: 'Cafe24 Dongdong, sans-serif', fontSize: '17.5px', letterSpacing: '-0.5px', color: '#000000', WebkitTextStroke: '0.2px #000000' }}>
                {STAT_LABELS[key]}
              </span>
              <div
                className="flex-1"
                style={{
                  height: '14px',
                  borderRadius: '999px',
                  backgroundColor: 'rgb(224, 239, 232)',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value * 10}%` }}
                  transition={{ type: 'spring', stiffness: 110, damping: 14 }}
                  style={{
                    height: '100%',
                    backgroundColor: 'rgb(88, 184, 136)',
                    borderRadius: '999px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginLeft: '4px',
                  fontFamily: 'Cafe24 Dongdong, sans-serif',
                  fontSize: '15.5px',
                  letterSpacing: '-0.5px',
                  color: '#FFFFFF',
                  WebkitTextStroke: '0.2px #FFFFFF',
                  backgroundColor: 'rgb(88, 184, 136)',
                  borderRadius: '999px',
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <svg width="100%" height="2" style={{ display: 'block', margin: '32px 0 26px' }}>
          <line x1="0" y1="1" x2="100%" y2="1" stroke="rgb(202, 230, 218)" strokeOpacity="0.65" strokeWidth="1.9" strokeDasharray="16 8" strokeLinecap="round" />
        </svg>

        <p style={{ fontFamily: 'Cafe24 Dongdong, sans-serif', fontSize: '23px', letterSpacing: '-0.5px', color: '#000000', WebkitTextStroke: '0.6px #000000', marginBottom: '18px' }}>
          댕댕 분석
        </p>
        <div className="flex flex-col" style={{ gap: '16px' }}>
          {sections.map((section) => (
            <div key={section.title}>
              <p
                className="flex items-center"
                style={{ fontFamily: 'Cafe24 Dongdong, sans-serif', fontSize: '18.5px', letterSpacing: '-0.5px', color: '#000000', WebkitTextStroke: '0.3px #000000', marginBottom: '3px', gap: isNarrow ? '9px' : '10px' }}
              >
                <Image src="/deang-saju/icons/bone.svg" alt="" width={isNarrow ? 20 : 22} height={isNarrow ? 20 : 22} />
                {section.title}
              </p>
              <p style={{ fontSize: '16.5px', letterSpacing: '-0.5px', color: 'rgb(52, 52, 52)', lineHeight: '1.5', marginLeft: '38px', paddingLeft: '1px' }}>{section.body}</p>
            </div>
          ))}
        </div>
      </DeangOutlineBox>

      <div className="flex" style={{ gap: '12px', padding: '0px' }}>
        {[
          { label: '찰떡', breed: bestMatch, image: `/deang-saju/breeds/${bestMatch.key}.png` },
          { label: '상극', breed: worstMatch, image: `/deang-saju/breeds/${worstMatch.key}.png` },
        ].map((item) => (
          <div key={item.label} className="flex-1" style={{ position: 'relative' }}>
            <DeangOutlineBox
              radius={20}
              backgroundColor="#FFFFFF"
              className="flex flex-col items-center"
              stitch
              stitchColor="rgb(202, 230, 218)"
              style={{
                padding: '56px 10px 30px',
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.2)), url(/deang-saju/title-bg2.png)',
                backgroundSize: 'cover, cover',
                backgroundPosition: 'center, center',
              }}
            >
              <div className="relative" style={{ width: '82%', aspectRatio: '1 / 1', marginTop: '8px', marginBottom: '-8px' }}>
                <Image src={item.image} alt={item.breed.breedName} fill unoptimized style={{ objectFit: 'contain' }} />
              </div>
              <p style={{ fontFamily: 'Cafe24 Dongdong, sans-serif', fontSize: isNarrow ? '15.5px' : '17px', color: '#000000', WebkitTextStroke: '0.2px #000000', textAlign: 'center' }}>
                {item.breed.breedName}
              </p>
            </DeangOutlineBox>
            <DeangOutlineBox
              radius={16}
              strokeWidth={0}
              backgroundColor="rgb(88, 184, 136)"
              stitch
              stitchInset={6}
              stitchRadius={12}
              stitchWidth={1.5}
              stitchColor="rgb(58, 148, 108)"
              stitchDasharray="8 5"
              style={{
                position: 'absolute',
                top: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: isNarrow ? '8px 36px' : '8px 48px',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontFamily: 'Cafe24 Dongdong, sans-serif', fontSize: isNarrow ? '15.5px' : '15px', color: '#FFFFFF', WebkitTextStroke: '0.3px #FFFFFF' }}>{item.label}</span>
            </DeangOutlineBox>
          </div>
        ))}
      </div>
    </div>
  );
}
