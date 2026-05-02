const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8800";
export const DASHBOARD_AUTH_COOKIE = "seller_token";

export function dashboardApiUrl(path: string): string {
  return `${API_URL}${path}`;
}

function readCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));

  if (!match) return null;
  return decodeURIComponent(match.slice(name.length + 1));
}

export function dashboardAuthHeaders(request?: Request): HeadersInit {
  const token =
    readCookie(request?.headers.get("cookie") ?? null, DASHBOARD_AUTH_COOKIE) ||
    process.env.SELLER_API_TOKEN;

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function proxyJsonResponse(response: Response): Promise<Response> {
  const body = await response.json().catch(() => ({}));

  return Response.json(body, {
    status: response.status,
  });
}
