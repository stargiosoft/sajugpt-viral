import { supabase } from '@/lib/supabase';

import type {
  GhostResult,
} from '@/types/ghost-tarot';

export async function getGhostCards()
: Promise<GhostResult[]> {

  const {
    data,
    error,
  } = await supabase
    .from('ghost_tarot_results')
    .select('*');

  if(error){
    console.error(error);
    return [];
  }
  return data as GhostResult[];
}