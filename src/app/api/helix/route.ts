import { NextResponse } from "next/server";
import type { DashboardApiResponse } from "@/lib/dashboard";
import { getDashboardSnapshot } from "@/lib/helix/serverCache";
import { HelixApiError } from "@/lib/helix";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Cache window in seconds — kept in sync with the server cache TTL so any CDN
// in front of this route also serves a shared response for up to 4 hours.
const CACHE_MAX_AGE_SECONDS = 4 * 60 * 60;

export async function GET() {
  try {
    const payload = await getDashboardSnapshot();
    const body: DashboardApiResponse = { ok: true, ...payload };

    return NextResponse.json(body, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_MAX_AGE_SECONDS}, stale-while-revalidate=600`,
      },
    });
  } catch (error) {
    console.error("[api/helix] failed to load dashboard snapshot:", error);
    console.count("Helix API Called");
    const isHelix = error instanceof HelixApiError;
    const body: DashboardApiResponse = {
      ok: false,
      error: {
        code: isHelix ? error.code : "internal_error",
        message: "Unable to load market data right now. Please try again shortly.",
      },
    };

    return NextResponse.json(body, { status: isHelix ? 502 : 500 });
  }
}
