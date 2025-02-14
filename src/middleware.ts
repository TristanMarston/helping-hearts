import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET!);
const adminUsername = process.env.ADMIN_USERNAME!;

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('user-token')?.value;

    if (!token && !request.nextUrl.pathname.startsWith('/admin/login')) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    } else {
        try {
            if (token) {
                const { payload } = await jwtVerify(token, jwtSecret);
                if (payload.data === adminUsername) {
                    if (request.nextUrl.pathname.startsWith('/admin/login')) return NextResponse.redirect(new URL('/admin', request.url));
                    else return NextResponse.next();
                }
                return NextResponse.next();
            }
            if (!request.nextUrl.pathname.startsWith('/admin/login')) return NextResponse.redirect(new URL('/admin/login', request.url));
        } catch (err) {
            if (!request.nextUrl.pathname.startsWith('/admin/login')) return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: '/admin/:path*',
};