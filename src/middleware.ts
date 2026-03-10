import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

export async function middleware(request: NextRequest) {
  // Only protect API routes
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Allow NextAuth routes
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // GET/HEAD/OPTIONS are public
  if (SAFE_METHODS.includes(request.method)) {
    return NextResponse.next();
  }

  // POST/PUT/DELETE require Bearer token
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const tenantId = process.env.AZURE_AD_TENANT_ID;
  const clientId = process.env.AZURE_AD_CLIENT_ID;

  if (!tenantId || !clientId) {
    console.error("Missing AZURE_AD_TENANT_ID or AZURE_AD_CLIENT_ID");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  try {
    const JWKS = createRemoteJWKSet(
      new URL(`https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`)
    );

    await jwtVerify(token, JWKS, {
      issuer: [
        `https://login.microsoftonline.com/${tenantId}/v2.0`,
        `https://sts.windows.net/${tenantId}/`,
      ],
      audience: clientId,
    });

    return NextResponse.next();
  } catch (err) {
    console.error("Token validation failed:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: "/api/:path*",
};
