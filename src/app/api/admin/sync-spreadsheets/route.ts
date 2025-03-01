import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const response = await axios.get(`${process.env.API_URL}/sync-spreadsheet`, {
            headers: {
                'x-api-key': process.env.API_KEY!,
            },
        });

        return NextResponse.json(response.data, { status: response.status });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error getting collection.' }, { status: error.response?.status ?? 500 });
    }
}
