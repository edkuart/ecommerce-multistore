import { NextResponse } from "next/server";
import {
  dashboardApiUrl,
  dashboardAuthHeaders,
  proxyJsonResponse,
} from "@/lib/dashboardProxy";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = new URLSearchParams();

    const productId = url.searchParams.get("productId");
    const storeId = url.searchParams.get("storeId");
    const type = url.searchParams.get("type");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    if (productId) params.set("productId", productId);
    if (storeId) params.set("storeId", storeId);
    if (type) params.set("type", type);
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    const path = params.toString()
      ? `/inventory/movements?${params.toString()}`
      : "/inventory/movements";

    const response = await fetch(dashboardApiUrl(path), {
      headers: dashboardAuthHeaders(request),
      cache: "no-store",
    });

    return proxyJsonResponse(response);
  } catch {
    return NextResponse.json(
      { message: "No se pudieron obtener los movimientos" },
      { status: 400 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(dashboardApiUrl("/inventory/movements"), {
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
      { message: "No se pudo registrar el movimiento" },
      { status: 400 },
    );
  }
}
