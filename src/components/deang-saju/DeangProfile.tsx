'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { DeangBreed } from '@/types/deang-saju';
import DeangOutlineBox from './DeangOutlineBox';
import useIsNarrow from '@/hooks/useIsNarrow';

interface Props {
  breed: DeangBreed;
  quip: string;
}

function PawIcon({ flipped }: { flipped?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transform: flipped ? 'scaleX(-1)' : undefined }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.67022 12.843C7.92154 11.8859 8.48261 11.0388 9.26591 10.4341C10.0492 9.82935 11.0106 9.5009 12.0002 9.5C12.9899 9.50085 13.9515 9.82926 14.735 10.434C15.5184 11.0387 16.0797 11.8858 16.3312 12.843C16.4232 13.191 16.6482 13.496 16.9732 13.734C17.5574 14.1633 18.0047 14.7526 18.261 15.4307C18.5172 16.1088 18.5715 16.8467 18.4172 17.555C18.297 18.1011 18.0562 18.6134 17.7125 19.0544C17.3687 19.4954 16.9306 19.8539 16.4304 20.1038C15.9301 20.3536 15.3804 20.4884 14.8213 20.4983C14.2622 20.5082 13.708 20.393 13.1992 20.161C12.8242 19.9856 12.4152 19.8947 12.0012 19.8947C11.5872 19.8947 11.1782 19.9856 10.8032 20.161C9.96027 20.5422 9.0061 20.5982 8.12435 20.3182C7.24259 20.0382 6.49555 19.442 6.02699 18.6442C5.55844 17.8465 5.40148 16.9037 5.58632 15.9972C5.77116 15.0907 6.28474 14.2846 7.02822 13.734C7.35122 13.496 7.57822 13.19 7.66822 12.844L7.67022 12.843Z" fill="#FFFFFF" />
      <path d="M9.35294 3C8.79131 3 8.25268 3.2218 7.85554 3.61662C7.4584 4.01143 7.23529 4.54691 7.23529 5.10526V6.15789C7.23529 6.71625 7.4584 7.25173 7.85554 7.64654C8.25268 8.04135 8.79131 8.26316 9.35294 8.26316C9.91458 8.26316 10.4532 8.04135 10.8503 7.64654C11.2475 7.25173 11.4706 6.71625 11.4706 6.15789V5.10526C11.4706 4.54691 11.2475 4.01143 10.8503 3.61662C10.4532 3.2218 9.91458 3 9.35294 3ZM14.6471 3C14.0854 3 13.5468 3.2218 13.1497 3.61662C12.7525 4.01143 12.5294 4.54691 12.5294 5.10526V6.15789C12.5294 6.71625 12.7525 7.25173 13.1497 7.64654C13.5468 8.04135 14.0854 8.26316 14.6471 8.26316C15.2087 8.26316 15.7473 8.04135 16.1445 7.64654C16.5416 7.25173 16.7647 6.71625 16.7647 6.15789V5.10526C16.7647 4.54691 16.5416 4.01143 16.1445 3.61662C15.7473 3.2218 15.2087 3 14.6471 3ZM18.8824 7.73684C18.3207 7.73684 17.7821 7.95865 17.385 8.35346C16.9878 8.74827 16.7647 9.28375 16.7647 9.84211V10.8947C16.7647 11.4531 16.9878 11.9886 17.385 12.3834C17.7821 12.7782 18.3207 13 18.8824 13C19.444 13 19.9826 12.7782 20.3798 12.3834C20.7769 11.9886 21 11.4531 21 10.8947V9.84211C21 9.28375 20.7769 8.74827 20.3798 8.35346C19.9826 7.95865 19.444 7.73684 18.8824 7.73684ZM5.11765 7.73684C4.55601 7.73684 4.01738 7.95865 3.62024 8.35346C3.22311 8.74827 3 9.28375 3 9.84211V10.8947C3 11.4531 3.22311 11.9886 3.62024 12.3834C4.01738 12.7782 4.55601 13 5.11765 13C5.67928 13 6.21791 12.7782 6.61505 12.3834C7.01219 11.9886 7.23529 11.4531 7.23529 10.8947V9.84211C7.23529 9.28375 7.01219 8.74827 6.61505 8.35346C6.21791 7.95865 5.67928 7.73684 5.11765 7.73684Z" fill="#FFFFFF" />
    </svg>
  );
}

export default function DeangProfile({ breed, quip }: Props) {
  const isNarrow = useIsNarrow();
  return (
    <div className="flex flex-col" style={{ gap: '8px' }}>
      <DeangOutlineBox
        radius={22}
        stitch
        stitchRadius={16}
        stitchColor="rgb(202, 230, 218)"
        style={{
          padding: '8px 20px 36px',
          textAlign: 'center',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.2)), url(/deang-saju/title-bg2.png)',
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center, center',
        }}
      >
        <div style={{ marginBottom: '3px' }}>
          <p
            style={{
              fontSize: isNarrow ? '16px' : '20px',
              letterSpacing: '-1.5px',
              fontWeight: 500,
              color: '#000000',
              WebkitTextStroke: '0.2px #000000',
              paddingTop: '24px',
            }}
          >
            {breed.title.slice(0, -breed.breedName.length).trim()}
          </p>
          <p
            style={{
              fontSize: isNarrow ? '34px' : '44px',
              letterSpacing: '-2.5px',
              fontWeight: 500,
              color: '#000000',
              WebkitTextStroke: '1.5px #000000',
              marginTop: isNarrow ? '-4px' : '-6px',
            }}
          >
            {breed.breedName}
          </p>
        </div>
        <div className="flex justify-center" style={{ marginTop: '-2px' }}>
          <DeangOutlineBox radius={999} strokeWidth={2} strokeColor="rgb(202, 230, 218)" backgroundColor="#FFFFFF" style={{ padding: isNarrow ? '2px 10px 2px' : '4px 12px 3px' }}>
            <span style={{ fontSize: isNarrow ? '13.5px' : '15.5px', letterSpacing: '-0.3px', color: 'rgb(45, 117, 81)', fontWeight: 500, whiteSpace: 'nowrap', WebkitTextStroke: '0.1px rgb(45, 117, 81)' }}>
              {breed.hashtags.join('   ')}
            </span>
          </DeangOutlineBox>
        </div>

        <div className="transform-gpu flex items-center justify-center" style={{ position: 'relative' }}>
          <div style={{ position: 'relative', transform: `translateY(${isNarrow ? '-24px' : '-32px'}) translateZ(0)` }}>
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ position: 'relative', width: isNarrow ? '210px' : '260px', height: isNarrow ? '210px' : '260px', marginTop: '4px', marginBottom: '8px' }}
            >
              <Image src={`/deang-saju/breeds/${breed.key}.png`} alt={breed.breedName} fill unoptimized style={{ objectFit: 'contain' }} />
            </motion.div>
          </div>

          <DeangOutlineBox
            radius={18}
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
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'max-content',
              maxWidth: 'calc(100vw - 64px)',
              bottom: '8px',
              zIndex: 5,
              padding: '12px 24px',
              textAlign: 'center',
            }}
          >
            <div className="flex items-center justify-center" style={{ gap: '8px' }}>
              <PawIcon />
              <p style={{ fontSize: '18px', letterSpacing: '-0.5px', color: '#FFFFFF', fontWeight: 500, WebkitTextStroke: '0.2px #FFFFFF', lineHeight: '1.5' }}>
                &ldquo; {quip.replace(/\.$/, '')} &rdquo;
              </p>
              <PawIcon flipped />
            </div>
          </DeangOutlineBox>
        </div>
      </DeangOutlineBox>
    </div>
  );
}
