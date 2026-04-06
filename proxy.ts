import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = ['http://localhost:3000', "https://a9de-180-149-217-221.ngrok-free.app", "https://aiseo.inboundcph.dk", "https://v3-ai-seo-stagging.up.railway.app"];

export function proxy(request: NextRequest) {
    const origin = request.headers.get('origin');

    // Check if the origin is in our allowed list
    const isAllowedOrigin = origin && allowedOrigins.includes(origin);

    // Handle Preflight (OPTIONS)
    if (request.method === 'OPTIONS') {
        const preflightHeaders = {
            // Must NOT be '*' if credentials are included
            'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400',
        };
        return new NextResponse(null, { status: 204, headers: preflightHeaders });
    }

    // Handle actual request
    const response = NextResponse.next();

    if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    return response;
}

export const config = {
    matcher: '/api/:path*',
};