import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { collection: string } }) {
    const { collection } = params;

    try {
        const response = await axios.get(`${process.env.API_URL}/${collection}`, {
            headers: {
                'x-api-key': process.env.API_KEY,
            },
        });

        return NextResponse.json(response.data, { status: response.status });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching collection.' }, { status: error.response?.status ?? 500 });
    }
}
