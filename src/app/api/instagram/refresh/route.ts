
import { NextResponse } from 'next/server';
import { getSupabaseService } from '@/lib/supabase-server';

/**
 * API Route to refresh the Instagram Long-Lived Access Token.
 * Expected to be called by a cron job once a month.
 * Target Table: store_config
 */
export async function GET() {
    const supabase = getSupabaseService();

    if (!supabase) {
        return NextResponse.json({ error: 'Supabase client not initialized. Check environment variables.' }, { status: 500 });
    }

    try {
        // 1. Get the current token from Supabase
        const { data: config, error: fetchError } = await supabase
            .from('store_config')
            .select('value')
            .eq('key', 'instagram_token')
            .single();

        if (fetchError || !config) {
            console.error('Error fetching token from Supabase:', fetchError);
            return NextResponse.json({ error: 'Token not found in database' }, { status: 404 });
        }

        const currentToken = config.value;

        // 2. Refresh the token with Instagram API
        // https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens#refresh-a-long-lived-access-token
        const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`;

        const response = await fetch(refreshUrl);
        const data = await response.json();

        if (!response.ok) {
            console.error('Instagram refresh error:', data);
            return NextResponse.json({ error: 'Failed to refresh token with Instagram', details: data }, { status: 500 });
        }

        const newToken = data.access_token;
        const expiresIn = data.expires_in; // Seconds

        // 3. Store the new token back in Supabase
        const { error: updateError } = await supabase
            .from('store_config')
            .update({
                value: newToken,
                updated_at: new Date().toISOString()
            })
            .eq('key', 'instagram_token');

        if (updateError) {
            console.error('Error updating token in Supabase:', updateError);
            return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Instagram token refreshed successfully',
            expires_in_days: Math.floor(expiresIn / 86400)
        });

    } catch (error: any) {
        console.error('Unexpected error during token refresh:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
    }
}
