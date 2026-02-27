'use server';

import { prisma } from '@/lib/prisma';

export async function sendMessage(data: any) {
    try {
        if (!data.name || !data.email || !data.subject || !data.message) {
            return { success: false, message: 'Invalid fields' };
        }

        await prisma.message.create({
            data: {
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
            },
        });

        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { success: false, message: 'Error sending message' };
    }
}
