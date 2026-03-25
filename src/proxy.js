import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'
// This function can be marked `async` if using `await` inside
const privateRoute = ["/cart"]
export async function proxy(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const isAuthenticated = Boolean(token)
    const reqPath = req.nextUrl.pathname
    const isPrivateReq = privateRoute.some((route) => req.nextUrl.pathname.startsWith(route))

    console.log({ token, isAuthenticated, isPrivateReq })
    if (!isAuthenticated && isPrivateReq) {
        return NextResponse.redirect(new URL(`/login?callbackUrl=${reqPath}`, req.url))
    }
    // return NextResponse.redirect(new URL('/', request.url))
    return NextResponse.next()
}

// Alternatively, you can use a default export:
// export default function proxy(request) { ... }

export const config = {
    matcher: ["/cart/:path*"],
}