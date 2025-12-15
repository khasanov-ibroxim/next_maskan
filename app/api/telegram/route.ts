    import { NextResponse } from 'next/server';

    export async function POST(req: Request) {
        try {
            const { name, phone, message } = await req.json();

            const text = `
    📩 *Yangi murojaat*
    👤 Ism: ${name}
    📞 Telefon: ${phone}
    💬 Xabar: ${message || '-'}
        `;

            const response = await fetch(
                `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: process.env.TELEGRAM_CHAT_ID,

                        // 🔥 MUHIM: theme (topic) ichiga yuborish
                        message_thread_id: Number(process.env.TELEGRAM_TOPIC_ID),

                        text,
                        parse_mode: 'Markdown'
                    })
                }
            );

            if (!response.ok) throw new Error('Telegram error');

            return NextResponse.json({ success: true });

        } catch (err) {
            console.error(err);
            return NextResponse.json({ success: false }, { status: 500 });
        }
    }
