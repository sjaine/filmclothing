import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const THREE_OR_LESS = ["★", "★☆", "★★", "★★☆", "★★★"];

export const RATING_LABELS: Record<string, string> = {
  "5 Stars": "★★★★★",
  "4.5 Stars": "★★★★☆",
  "4 Stars": "★★★★",
  "3.5 Stars": "★★★☆",
  "~3 Stars": "★★★",
};

export async function getBlogPosts(cursor?: string, rating?: string) {
  const databaseId = process.env.NOTION_DATABASE_ID as string;

  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID Error.");
  }

  let filterCondition: any = undefined;

  if (rating) {
    if (rating === "★★★") {
      filterCondition = {
        or: THREE_OR_LESS.map((r) => ({
          property: "ratings",
          rich_text: { equals: r },
        })),
      };
    } else {
      filterCondition = {
        property: "ratings",
        rich_text: {
          equals: rating,
        },
      };
    }
  }

  const startCursor =
    cursor === "null" || cursor === "undefined" || !cursor ? undefined : cursor;

  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 15,
    start_cursor: startCursor,
    filter: filterCondition,
    sorts: [
      {
        timestamp: "created_time",
        direction: "descending",
      },
    ],
  });

  const posts = response.results.map((page: any) => ({
    id: page.id,
    title: page.properties["title"]?.title?.[0]?.text?.content || "Untitled",
    year: page.properties["year"]?.rich_text?.[0]?.text?.content || "",
    ratings: [page.properties["ratings"]?.rich_text?.[0]?.text?.content || ""],
    poster: page.properties["poster"]?.rich_text?.[0]?.text?.content || "",
  }));

  return {
    posts,
    nextCursor: response.next_cursor,
    hasMore: response.has_more,
  };
}

export async function getRatingCounts() {
  const databaseId = process.env.NOTION_DATABASE_ID as string;

  const categoryCounts = await Promise.all(
    Object.entries(RATING_LABELS).map(async ([label, value]) => {
      let filter: any;

      if (value === "★★★") {
        filter = {
          or: THREE_OR_LESS.map((r) => ({
            property: "ratings",
            rich_text: { equals: r },
          })),
        };
      } else {
        filter = {
          property: "ratings",
          rich_text: { equals: value },
        };
      }

      const response = await notion.databases.query({
        database_id: databaseId,
        filter: filter,
      });

      return { value, count: response.results.length };
    })
  );

  let allResults: any[] = [];
  let hasMore = true;
  let cursor: string | undefined = undefined;

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
    });
    allResults = [...allResults, ...response.results];
    hasMore = response.has_more;
    cursor = response.next_cursor || undefined;
  }

  const totalCount = allResults.length;

  const countsObj = categoryCounts.reduce((acc, curr) => {
    acc[curr.value] = curr.count;
    return acc;
  }, {} as Record<string, number>);

  countsObj["all"] = totalCount;

  return countsObj;
}
