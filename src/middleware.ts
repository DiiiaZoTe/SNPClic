// middleware.ts
import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SKIP_MIDDLEWARE = [
  "/",
  "/contact",
  "/faq",
  "/mentions-legales",
  "/conditiond-utilisation",
  "/politique-confidentialite",
]

export async function middleware(request: NextRequest) {
  console.log(`${request.headers.get("x-forwarded-for")} -> ${request.nextUrl.pathname} in ${process.env.NEXT_PUBLIC_ENVIRONMENT}`);

  // Skip middleware for certain paths
  if (skipMiddleware(request)) return NextResponse.next();
  // Check if the request is from the same origin
  return isSameOrigin(request);
}

function skipMiddleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  return SKIP_MIDDLEWARE.includes(url);
}

function isSameOrigin(request: NextRequest) {
  if (request.method === "GET") {
    return NextResponse.next();
  }
  const originHeader = request.headers.get("Origin");
  const hostHeader = request.headers.get("Host");
  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next|favicon/|og.png|sitemap.xml|robots.txt).*)",
  ],
};