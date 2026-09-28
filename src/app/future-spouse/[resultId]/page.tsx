import { getSajuData, parseFutureSpouseResult } from '@/lib/future-spouse/spouse';
import SpouseResult from '@/components/future-spouse/SpouseResult';
import type { SpouseFormInput } from '@/types/spouse';

interface Props {
  params: Promise<{
    resultId: string;
  }>;
  searchParams: Promise<{
    birthday?: string;
    birthDate?: string;
    birthTime?: string;
    birthTimeUnknown?: string;
    gender?: 'male' | 'female';
    resultId?: string;
  }>;
}

export default async function ResultPage({ params, searchParams }: Props) {
  const { resultId: routeResultId } = await params;
  const search = await searchParams;

  const birthday = search.birthday || search.birthDate;
  const gender = search.gender;

  if (!birthday || !gender) {
    return (
      <main className="mx-auto max-w-110 px-5 py-20 text-center min-h-screen bg-white flex flex-col justify-center items-center">
        <p className="text-gray-700 text-base font-medium">
          생년월일 및 성별 정보가 필요해요.
        </p>
        <a
          href="/future-spouse"
          className="mt-4 px-4 py-2 bg-[rgb(235,85,108)] text-white text-sm font-semibold rounded-xl"
        >
          입력 페이지로 돌아가기
        </a>
      </main>
    );
  }

  const input: SpouseFormInput = {
    birthday,
    gender,
    birthTime: search.birthTime || '',
    birthTimeUnknown: search.birthTimeUnknown === 'true',
  };

  const { sajuRawData, resultId: apiResultId } = await getSajuData(input);
  const result = parseFutureSpouseResult(sajuRawData, input.gender);

  return (
    <SpouseResult
      result={result}
      resultId={routeResultId || search.resultId || apiResultId}
    />
  );
}