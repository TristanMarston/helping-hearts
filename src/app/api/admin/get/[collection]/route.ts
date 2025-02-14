import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ collection: string }> }) {
    const { collection } = await params;

    console.log(collection);
    try {
        const response = await axios.get(`${process.env.API_URL}/${collection}`, {
            headers: {
                'x-api-key': process.env.API_KEY!,
            },
        });

        return NextResponse.json(response.data, { status: response.status });
    } catch (error: any) {
        console.log(error.response);
        return NextResponse.json({ message: 'Error getting collection.' }, { status: error.response?.status ?? 500 });
    }
}
