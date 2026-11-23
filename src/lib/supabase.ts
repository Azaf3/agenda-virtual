import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  throw new Error(
    'Faltam VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY. Copie .env.example para .env.local e preencha com a saída de `npx supabase status`.',
  )
}

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
})
