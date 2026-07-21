import GhostCommentSection from '@/components/ghost-tarot/GhostCommentSection';
import { DEANG_COLORS as C } from '@/constants/deangTheme';

export default function DeangCommentSection() {
  return (
    <div style={{ marginTop: '32px' }}>
      <GhostCommentSection
        featureType="deang_saju"
        colors={C.comment}
        placeholder="같이 이야기해요 :)"
        replyPlaceholder="같이 이야기해요 :)"
        fontFamily="'Pretendard Variable', Pretendard, sans-serif"
      />
    </div>
  );
}
