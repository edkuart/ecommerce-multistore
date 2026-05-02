import { NextResponse } from "next/server";
import {
  dashboardApiUrl,
  dashboardAuthHeaders,
  proxyJsonResponse,
} from "@/lib/dashboardProxy";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const storeId = url.searchParams.get("storeId");
    const path = storeId
      ? `/leads?storeId=${encodeURIComponent(storeId)}`
      : "/leads";
    const response = await fetch(dashboardApiUrl(path), {
      headers: dashboardAuthHeaders(request),
      cache: "no-store",
    });

    return proxyJsonResponse(response);
  } catch {
    return NextResponse.json(
      { message: "Could not fetch leads" },
      { status: 400 },
    );
  }
}
