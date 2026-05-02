import { NextResponse } from "next/server";
import {
  dashboardApiUrl,
  dashboardAuthHeaders,
  proxyJsonResponse,
} from "@/lib/dashboardProxy";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const formData = await request.formData();

    const response = await fetch(
      dashboardApiUrl(`/products/${encodeURIComponent(params.id)}`),
      {
        method: "PUT",
        headers: dashboardAuthHeaders(request),
        body: formData,
      },
    );

    return proxyJsonResponse(response);
  } catch {
    return NextResponse.json(
      { message: "Could not update product" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const response = await fetch(
      dashboardApiUrl(`/products/${encodeURIComponent(params.id)}`),
      {
        method: "DELETE",
        headers: dashboardAuthHeaders(request),
      },
    );

    if (response.status === 204) {
      return new Response(null, { status: 204 });
    }

    return proxyJsonResponse(response);
  } catch {
    return NextResponse.json(
      { message: "Could not delete product" },
      { status: 400 },
    );
  }
}
