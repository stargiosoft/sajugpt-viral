'use client';

import Toast from '@/components/Toast';
import MoneyIconButton from './MoneyIconButton';
import { KakaoIcon, XIcon, CopyIcon } from '@/components/ShareIcons';
import { useShare, type ShareContent } from '@/lib/useShare';
import { MONEY_COLORS as C } from '@/constants/moneyTimelineTheme';

const ICON_STYLE = { width: 42, height: 42, border: 'none' };

interface Props {
  shareContent: ShareContent;
}

export default function ShareIconRow({ shareContent }: Props) {
  const { shareToKakao, shareToX, copyLink, copied, toastMessage } = useShare(shareContent);

  return (
    <div className="flex justify-center" style={{ gap: '20px' }}>
      <MoneyIconButton ariaLabel="카카오톡 공유" onClick={shareToKakao} style={{ ...ICON_STYLE, background: '#FEE500' }} hoverBackground="#F0D900">
        <KakaoIcon color="#000000" />
      </MoneyIconButton>
      <MoneyIconButton ariaLabel="X 공유" onClick={shareToX} style={{ ...ICON_STYLE, background: '#000000' }} hoverBackground="#222222">
        <XIcon color="#FFFFFF" />
      </MoneyIconButton>
      <MoneyIconButton ariaLabel="링크 복사" onClick={copyLink} style={{ ...ICON_STYLE, background: C.gold }} hoverBackground="rgb(95, 74, 220)">
        <CopyIcon color={C.textOnGold} copied={copied} />
      </MoneyIconButton>
      <Toast message={toastMessage} paddingY="10px" />
    </div>
  );
}
