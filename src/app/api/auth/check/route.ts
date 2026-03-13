import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Check Azure AD Easy Auth
  const easyAuthPrincipal = request.headers.get("x-ms-client-principal");
  if (easyAuthPrincipal) {
    return NextResponse.json({ isAdmin: true, method: "azure-ad" });
  }

  // Check password cookie
  const token = request.cookies.get("admin_token")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminPassword && token === adminPassword) {
    return NextResponse.json({ isAdmin: true, method: "password" });
  }

  return NextResponse.json({ isAdmin: false });
}
