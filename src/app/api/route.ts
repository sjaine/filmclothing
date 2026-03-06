import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, getRatingCounts } from "../data/notion";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const cursor = searchParams.get("cursor") || undefined;
  const rating = searchParams.get("rating") || undefined;

  try {
    if (type === "counts") {
      const counts = await getRatingCounts();
      return NextResponse.json(counts, {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    const data = await getBlogPosts(cursor, rating);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
