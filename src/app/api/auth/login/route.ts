import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getRateLimitKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  const ip = getRateLimitKey(request);
  const now = Date.now();

  // Check rate limit
  const entry = attempts.get(ip);
  if (entry) {
    if (now > entry.resetAt) {
      attempts.delete(ip);
    } else if (entry.count >= MAX_ATTEMPTS) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return NextResponse.json(
        { error: `登录尝试过多，请 ${Math.ceil(retryAfter / 60)} 分钟后再试` },
        { status: 429 }
      );
    }
  }

  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD!;

  if (password === adminPassword) {
    attempts.delete(ip); // Reset on success
    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_token", adminPassword, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return response;
  }

  // Record failed attempt
  const current = attempts.get(ip);
  if (current) {
    current.count++;
  } else {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }

  return NextResponse.json({ error: "密码错误" }, { status: 401 });
}
