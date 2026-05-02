import { NextResponse } from "next/server";
import {
  DASHBOARD_AUTH_COOKIE,
  dashboardApiUrl,
} from "@/lib/dashboardProxy";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(dashboardApiUrl("/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload.token) {
      return NextResponse.json(payload, { status: response.status });
    }

    const nextResponse = NextResponse.json(
      { user: payload.user },
      { status: 200 },
    );

    nextResponse.cookies.set({
      name: DASHBOARD_AUTH_COOKIE,
      value: payload.token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return nextResponse;
  } catch {
    return NextResponse.json(
      { message: "Could not login" },
      { status: 400 },
    );
  }
}
