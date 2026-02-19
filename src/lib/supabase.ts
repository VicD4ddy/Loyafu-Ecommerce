import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Singleton instance of the Supabase client
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Service role client for server-side operations that bypass RLS.
 * Only use this in API routes and server components.
 */
export const getSupabaseService = () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
    if (!supabaseUrl || !serviceRoleKey) {
        console.warn('Supabase URL or Service Role Key missing. Returning null client.');
        return null;
    }
    return createClient(supabaseUrl, serviceRoleKey);
};
