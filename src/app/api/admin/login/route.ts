import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';

const adminUsername = process.env.ADMIN_USERNAME!;
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH!;
const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (username === adminUsername && bcrypt.compareSync(password, adminPasswordHash)) {
            const token = await new SignJWT({ data: username }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('3h').sign(jwtSecret);

            const response = NextResponse.json({ success: true });
            response.cookies.set('user-token', token, {
                httpOnly: true,
                secure: true,
                path: '/',
                sameSite: 'strict',
                maxAge: 1800,
            });
            return response;
        } else {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }
    } catch (e: any) {
        console.log('error:', e);
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}
