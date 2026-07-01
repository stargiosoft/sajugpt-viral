import type { Metadata } from 'next';
import PolicyLayout, { InfoSection } from '@/components/policy/PolicyLayout';

export const metadata: Metadata = {
  title: '모아모아 소개 | 모아모아',
};

export default function AboutPage() {
  return (
    <PolicyLayout title="모아모아 소개">
      <InfoSection
        title="모아모아는 이런 곳이에요"
        paragraphs={[
          '모아모아는 사주와 심리, 성향을 소재로 한 다양한 테스트와 콘텐츠를 한곳에 모아둔 서비스예요. 색기 배틀, 사주 부검실, 주가 조작단, 사주 법정, 기생 시뮬레이션처럼 저마다 다른 방식으로 재미를 주는 테스트들을 계속 만들어 채워가고 있어요.',
          '회원가입 없이 생년월일 몇 가지만 입력하면 바로 결과를 확인할 수 있고, 결과는 카드 이미지로 저장하거나 친구에게 공유할 수 있도록 만들었어요.',
        ]}
      />
      <InfoSection
        title="왜 이름이 모아모아인가요"
        paragraphs={[
          '"모아모아"는 "모으다"라는 말을 두 번 겹쳐 쓴 이름이에요. 여기저기 흩어져 있던 재미있는 테스트와 콘텐츠를 한자리에 다 모아모아 놓겠다는 뜻을 담았어요.',
          '동시에 "모아모아"라는 발음이 주는 친근하고 귀여운 어감도 마음에 들었어요. 부담 없이 들어와서 가볍게 즐기다 갈 수 있는 공간이라는 느낌을 이름에 담고 싶었습니다.',
        ]}
      />
      <InfoSection
        title="모아모아가 만들어가는 것"
        paragraphs={[
          '사주GPT가 쌓아온 사주 데이터와 AI 기술을 바탕으로, 무겁지 않으면서도 그럴듯한 재미를 주는 콘텐츠를 계속 만들어가고 있어요.',
          '앞으로도 다양한 테스트와 시뮬레이션을 꾸준히 추가해서, 모아모아에 들를 때마다 새로운 재미를 발견할 수 있는 공간으로 만들어 갈게요.',
        ]}
      />
    </PolicyLayout>
  );
}
