import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

// Trusted MI app IDs that can write via Bearer token
const ALLOWED_APP_IDS = [
  "f2ada564-633e-42f7-baad-d90d7a5eff81", // openclaw-wus3-00
];

function verifyBearerToken(authHeader: string): boolean {
  try {
    const token = authHeader.replace("Bearer ", "");
    const payload = token.split(".")[1];
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());

    // Check issuer matches our tenant
    if (decoded.iss !== "https://login.microsoftonline.com/16b3c013-d300-468d-ac64-7eda0820b6d3/v2.0") {
      return false;
    }

    // Check audience matches our app
    if (decoded.aud !== "a08c02be-1de7-4b06-89d2-ae44f0b1d121") {
      return false;
    }

    // Check azp (client app) is in allowed list
    if (!ALLOWED_APP_IDS.includes(decoded.azp)) {
      return false;
    }

    // Check not expired
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  // Only protect API write routes
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Auth routes are always open
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // GET is public (read-only)
  if (SAFE_METHODS.includes(request.method)) {
    return NextResponse.next();
  }

  // POST/PUT/DELETE require authentication via:
  // 1. Azure AD Easy Auth (X-MS-CLIENT-PRINCIPAL header, set by platform after browser login)
  const easyAuthPrincipal = request.headers.get("x-ms-client-principal");
  if (easyAuthPrincipal) {
    return NextResponse.next();
  }

  // 2. Bearer token from trusted MI (app-to-app)
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ") && verifyBearerToken(authHeader)) {
    return NextResponse.next();
  }

  // 3. Admin password cookie (fallback)
  const token = request.cookies.get("admin_token")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminPassword && token === adminPassword) {
    return NextResponse.next();
  }

  return NextResponse.json({ error: "请先登录" }, { status: 401 });
}

export const config = {
  matcher: "/api/:path*",
};
