// /api/me/route.ts
import { getUser } from "@/lib/auth";

export async function GET() {
  const { user, error } = await getUser();

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }

  return Response.json(user);
}