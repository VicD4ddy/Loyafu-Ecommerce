export const runtime = 'edge';

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
            console.warn('Instagram token not found in DB or Supabase not initialized, falling back to ENV');
            token = process.env.NEXT_PUBLIC_INSTAGRAM_TOKEN || null;
        }

        if (!token) {
            return NextResponse.json({ data: [] });
        }

        return fetchInstagramData(token);

    } catch (error: any) {
        console.error('Instagram feed route error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function fetchInstagramData(token: string) {
    try {
        // 1. Fetch User Data (Profile Info)
        const userRes = await fetch(`https://graph.instagram.com/me?fields=id,username,media_count,account_type&access_token=${token}`, {
            next: { revalidate: 3600 }
        });

        // 2. Fetch Media Data (Posts)
        const mediaRes = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${token}`, {
            next: { revalidate: 3600 }
        });

        if (!userRes.ok || !mediaRes.ok) {
            console.error('Instagram API Error:', await userRes.text(), await mediaRes.text());
            return NextResponse.json({ error: 'Failed to fetch Instagram data' }, { status: 500 });
        }

        const user = await userRes.json();
        const media = await mediaRes.json();

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
