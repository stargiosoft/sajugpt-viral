'use client';

import Toast from '@/components/Toast';
import ShareIconButton from '@/components/ShareIconButton';
import { KakaoIcon, XIcon, CopyIcon } from '@/components/ShareIcons';
import { useShare, type ShareContent } from '@/lib/useShare';

const ICON_STYLE = { width: 42, height: 42, border: 'none' };

interface Props {
  shareContent: ShareContent;
}

export default function AutopsyLandingShareRow({ shareContent }: Props) {
  const { shareToKakao, shareToX, copyLink, copied, toastMessage } = useShare(shareContent);

  return (
    <div className="flex justify-center" style={{ gap: '20px' }}>
      <ShareIconButton ariaLabel="카카오톡 공유" onClick={shareToKakao} style={{ ...ICON_STYLE, background: '#FEE500' }} hoverBackground="#F0D900">
        <KakaoIcon color="#000000" />
      </ShareIconButton>
      <ShareIconButton ariaLabel="X 공유" onClick={shareToX} style={{ ...ICON_STYLE, background: '#000000' }} hoverBackground="#222222">
        <XIcon color="#FFFFFF" />
      </ShareIconButton>
      <ShareIconButton ariaLabel="링크 복사" onClick={copyLink} style={{ ...ICON_STYLE, background: '#7A38D8' }} hoverBackground="#6B2FC2">
        <CopyIcon color="#FFFFFF" copied={copied} />
      </ShareIconButton>
      <Toast message={toastMessage} paddingY="10px" />
    </div>
  );
}
