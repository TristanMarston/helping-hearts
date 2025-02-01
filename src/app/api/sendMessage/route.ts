import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    try {
        const formData = await request.json();
        if (formData.message && formData.email) {
            const response = await axios.post(`${process.env.API_URL}/messages`, formData, {
                headers: {
                    'x-api-key': process.env.API_KEY,
                },
            });
            return NextResponse.json(response.data, { status: response.status });
        } else NextResponse.json({ message: 'Invalid fields', status: 500 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error sending message' }, { status: error.response?.status || 500 });
    }
}
