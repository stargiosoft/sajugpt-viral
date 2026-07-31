import { supabase } from '@/lib/supabase';
import type { OhengPrescription } from '@/types/oheng';

export async function fetchOhengResultById(resultId: string): Promise<OhengPrescription | null> {
  const { data, error } = await supabase
    .from('oheng_results')
    .select('id, prescription')
    .eq('id', resultId)
    .single();

  if (error || !data?.prescription) return null;

  return {
    success: true,
    resultId: data.id,
    ...data.prescription,
  } as OhengPrescription;
}
