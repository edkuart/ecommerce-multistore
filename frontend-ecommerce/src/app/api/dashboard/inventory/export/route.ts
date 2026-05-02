import { NextResponse } from "next/server";
import { dashboardApiUrl, dashboardAuthHeaders } from "@/lib/dashboardProxy";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = new URLSearchParams();
    const passthroughParams = ["productId", "storeId", "type", "from", "to"];

    for (const key of passthroughParams) {
      const value = url.searchParams.get(key);
      if (value) params.set(key, value);
    }

    const path = params.toString()
      ? `/inventory/export?${params.toString()}`
      : "/inventory/export";
    const response = await fetch(dashboardApiUrl(path), {
      headers: dashboardAuthHeaders(request),
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({
        message: "No se pudo exportar el inventario",
      }));
      return NextResponse.json(body, { status: response.status });
    }

    const csv = await response.text();
    const headers = new Headers({
      "Content-Type": response.headers.get("Content-Type") ?? "text/csv; charset=utf-8",
      "Content-Disposition":
        response.headers.get("Content-Disposition") ??
        'attachment; filename="inventario.csv"',
    });

    return new Response(csv, {
      status: 200,
      headers,
    });
  } catch {
    return NextResponse.json(
      { message: "No se pudo exportar el inventario" },
      { status: 400 },
    );
  }
}
