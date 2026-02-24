
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Fetches the Instagram feed using the latest token from Supabase.
 * Keeps the token secret from the client side.
 */
export async function GET() {
    try {
        // 1. Get the current token from Supabase
        let token: string | null = null;

        if (supabase) {
            const { data: config, error: fetchError } = await supabase
                .from('store_config')
                .select('value')
                .eq('key', 'instagram_token')
                .single();

            if (!fetchError && config) {
                token = config.value;
            }
        }

        if (!token) {
            const envToken = process.env.NEXT_PUBLIC_INSTAGRAM_TOKEN;
            console.warn('Instagram token not found in Supabase. Checking ENV...');
            console.log('ENV NEXT_PUBLIC_INSTAGRAM_TOKEN exists:', !!envToken);
            console.log('ENV NEXT_PUBLIC_INSTAGRAM_TOKEN length:', envToken?.length || 0);
            token = envToken || null;
        }

        if (!token) {
            console.error('CRITICAL: Instagram token not found in Supabase OR Environment Variables');
            return NextResponse.json({
                error: 'Token missing',
                debug: {
                    supabase_initialized: !!supabase,
                    env_token_exists: !!process.env.NEXT_PUBLIC_INSTAGRAM_TOKEN,
                    env_fallback_attempted: true
                }
            }, { status: 401 });
        }

        return fetchInstagramData(token);

    } catch (error: any) {
        console.error('Instagram feed route exception:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

async function fetchInstagramData(token: string) {
    try {
        // 1. Fetch User Data (Profile Info)
        const userRes = await fetch(`https://graph.instagram.com/me?fields=id,username,media_count,account_type&access_token=${token}&t=${Date.now()}`, {
            cache: 'no-store'
        });

        // 2. Fetch Media Data (Posts)
        const mediaRes = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${token}&t=${Date.now()}`, {
            cache: 'no-store'
        });

        if (!userRes.ok || !mediaRes.ok) {
            const userErr = await userRes.json().catch(() => ({}));
            const mediaErr = await mediaRes.json().catch(() => ({}));
            console.error('Instagram API Error Details:', { userErr, mediaErr });
            return NextResponse.json({
                error: 'Failed to fetch Instagram data',
                instagram_error: userErr.error || mediaErr.error || 'Unknown Instagram API error'
            }, { status: userRes.status === 401 || mediaRes.status === 401 ? 401 : 502 });
        }

        const user = await userRes.json();
        const media = await mediaRes.json();

        // Diagnostic logging for production Reels issue
        if (media.data && media.data.length > 0) {
            console.log(`Instagram API returned ${media.data.length} items.`);
            media.data.slice(0, 10).forEach((item: any, i: number) => {
                console.log(`Item ${i}: ID=${item.id}, Type=${item.media_type}, HasThumbnail=${!!item.thumbnail_url}`);
            });
        }

        return NextResponse.json({
            user: {
                username: user.username,
                media_count: user.media_count,
                account_type: user.account_type
            },
            data: media.data
        });
    } catch (error) {
        console.error('fetchInstagramData error:', error);
        return NextResponse.json({ error: 'Failed to connect to Instagram' }, { status: 500 });
    }
}
