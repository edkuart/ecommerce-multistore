import { NextResponse } from "next/server";
import {
  dashboardApiUrl,
  dashboardAuthHeaders,
  proxyJsonResponse,
} from "@/lib/dashboardProxy";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(dashboardApiUrl("/stores"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...dashboardAuthHeaders(request),
      },
      body: JSON.stringify(body),
    });

    return proxyJsonResponse(response);
  } catch {
    return NextResponse.json(
      { message: "Could not create store" },
      { status: 400 },
    );
  }
}
