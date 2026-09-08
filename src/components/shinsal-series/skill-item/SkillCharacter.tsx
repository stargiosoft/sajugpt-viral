'use client';

import Image from 'next/image';

interface AvatarData {
  id?: string;
  name?: string;
  animal?: string;
  imageUrl?: string;
}

interface Props {
  avatar?: AvatarData;
  yearBranch?: string;
}

export default function SkillCharacter({ avatar, yearBranch }: Props) {
  const characterImage =
    avatar?.imageUrl ||
    (yearBranch === '巳'
      ? '/shinsal-series/images/avatars/snake.png'
      : '/shinsal-series/images/avatars/rat.png');

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <div className="relative w-24 h-24">
        <Image
          src={characterImage}
          alt={avatar?.name || '사주 캐릭터'}
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}