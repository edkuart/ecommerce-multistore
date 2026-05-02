import { NextResponse } from "next/server";
import {
  dashboardApiUrl,
  dashboardAuthHeaders,
  proxyJsonResponse,
} from "@/lib/dashboardProxy";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const response = await fetch(dashboardApiUrl("/products"), {
      method: "POST",
      headers: dashboardAuthHeaders(request),
      body: formData,
    });

    return proxyJsonResponse(response);
  } catch {
    return NextResponse.json(
      { message: "Could not create product" },
      { status: 400 },
    );
  }
}
