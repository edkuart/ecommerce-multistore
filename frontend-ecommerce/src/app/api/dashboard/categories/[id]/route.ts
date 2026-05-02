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
    const body = await request.json();

    const response = await fetch(
      dashboardApiUrl(`/categories/${encodeURIComponent(params.id)}`),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...dashboardAuthHeaders(request),
        },
        body: JSON.stringify(body),
      },
    );

    return proxyJsonResponse(response);
  } catch {
    return NextResponse.json(
      { message: "Could not update category" },
      { status: 400 },
    );
  }
}
