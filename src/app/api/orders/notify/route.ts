import { NextRequest, NextResponse } from 'next/server';

async function sendCallMeBot(message: string) {
    const phones = process.env.CALLMEBOT_PHONE?.split(',').map(p => p.trim()).filter(Boolean) || [];
    const apiKeys = process.env.CALLMEBOT_API_KEY?.split(',').map(k => k.trim()).filter(Boolean) || [];

    if (phones.length === 0 || apiKeys.length === 0 || phones.length !== apiKeys.length) {
        console.warn('⚠️ CallMeBot not configured. WhatsApp notification skipped.');
        return { sent: 0, total: 0 };
    }

    const encodedMessage = encodeURIComponent(message);
    const results = await Promise.allSettled(
        phones.map((phone, i) => {
            const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKeys[i]}`;
            return fetch(url, { method: 'GET', signal: AbortSignal.timeout(10000) })
                .then(async (res) => {
                    if (!res.ok) console.error(`CallMeBot error for ${phone}:`, res.status);
                    else console.log(`✅ WhatsApp sent to ${phone}`);
                    return res.ok;
                });
        })
    );

    const sent = results.filter(r => r.status === 'fulfilled' && r.value).length;
    return { sent, total: phones.length };
}

async function sendTelegram(message: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatIds = process.env.TELEGRAM_CHAT_ID?.split(',').map(id => id.trim()).filter(Boolean) || [];

    if (!botToken || chatIds.length === 0) {
        console.warn('⚠️ Telegram not configured. Telegram notification skipped.');
        return { sent: 0, total: 0 };
    }

    const results = await Promise.allSettled(
        chatIds.map(chatId => {
            const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
            return fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML',
                }),
                signal: AbortSignal.timeout(10000),
            }).then(async (res) => {
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    console.error(`Telegram error for chat ${chatId}:`, err);
                }
                else console.log(`✅ Telegram sent to chat ${chatId}`);
                return res.ok;
            });
        })
    );

    const sent = results.filter(r => r.status === 'fulfilled' && r.value).length;
    return { sent, total: chatIds.length };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Send to both channels in parallel
        const [whatsapp, telegram] = await Promise.all([
            sendCallMeBot(message),
            sendTelegram(message),
        ]);

        console.log(`📲 Notifications — WhatsApp: ${whatsapp.sent}/${whatsapp.total} | Telegram: ${telegram.sent}/${telegram.total}`);

        return NextResponse.json({
            success: true,
            whatsapp,
            telegram,
        });

    } catch (error) {
        console.error('Error sending notifications:', error);
        return NextResponse.json({ success: true, notified: false, reason: 'Internal error' });
    }
}
