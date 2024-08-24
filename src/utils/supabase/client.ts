import { createClient } from '@supabase/supabase-js'
import assert from 'assert'

assert(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  'Missing env var: NEXT_PUBLIC_SUPABASE_URL'
)
assert(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'Missing env var: NEXT_PUBLIC_SUPABASE_ANON_KEY'
)

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    global: {
      fetch: (url: any, options = {}) => {
        return fetch(url, { ...options, cache: 'no-store' })
      },
    },
  }
)
