'use client';

import Toast from '@/components/Toast';
import GhostIconButton from '@/components/ghost-tarot/GhostIconButton';
import { KakaoIcon, XIcon, CopyIcon } from '@/components/ShareIcons';
import { useShare, type ShareContent } from '@/lib/useShare';

const ICON_STYLE = { width: 42, height: 42, border: 'none' };

interface Props {
  shareContent: ShareContent;
  copyColor: string;
  copyHoverColor: string;
  copyIconColor?: string;
}

export default function ShareRow({ shareContent, copyColor, copyHoverColor, copyIconColor = '#FFFFFF' }: Props) {
  const { shareToKakao, shareToX, copyLink, copied, toastMessage } = useShare(shareContent);

  return (
    <div className="flex justify-center" style={{ gap: '20px' }}>
      <GhostIconButton ariaLabel="카카오톡 공유" onClick={shareToKakao} style={{ ...ICON_STYLE, background: '#FEE500' }} hoverBackground="#F0D900">
        <KakaoIcon color="#000000" />
      </GhostIconButton>
      <GhostIconButton ariaLabel="X 공유" onClick={shareToX} style={{ ...ICON_STYLE, background: '#000000' }} hoverBackground="#222222">
        <XIcon color="#FFFFFF" />
      </GhostIconButton>
      <GhostIconButton ariaLabel="링크 복사" onClick={copyLink} style={{ ...ICON_STYLE, background: copyColor }} hoverBackground={copyHoverColor}>
        <CopyIcon color={copyIconColor} copied={copied} />
      </GhostIconButton>
      <Toast message={toastMessage} paddingY="10px" />
    </div>
  );
}
