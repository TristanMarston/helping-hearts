'use server';

import { prisma } from '@/lib/prisma';

export async function sendMessage(data: any) {
    try {
        if (!data.email || !data.message) {
            return { success: false, message: 'Invalid fields' };
        }

        await prisma.message.create({
            data,
        });

        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { success: false, message: 'Error sending message' };
    }
}
