import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await request.json();

    if (Object.keys(data).length === 0) {
        return NextResponse.json({ message: 'Please provide body.' }, { status: 400 });
    }

    try {
        const response = await axios.post(`${process.env.API_URL}/dpi-youth-participants/payment/${id}`, data, {
            headers: {
                'x-api-key': process.env.API_KEY!,
            },
        });

        return NextResponse.json(response.data, { status: response.status });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: error.response?.status ?? 500 });
    }
}
