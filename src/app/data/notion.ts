import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function getBlogPosts(cursor?: string) {
  const databaseId = process.env.NOTION_DATABASE_ID as string;

  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID Error.");
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 15,
    start_cursor: cursor || undefined,
    sorts: [
      {
        timestamp: 'created_time',
        direction: 'descending', 
      },
    ],
  });

  const posts = response.results.map((page: any) => ({
    id: page.id,
    title: page.properties['title']?.title?.[0]?.text?.content || 'Untitled',
    year: page.properties['year']?.rich_text?.[0]?.text?.content || '',
    ratings: page.properties['ratings']?.rich_text?.[0]?.text?.content || '',
    poster: page.properties['poster']?.rich_text?.[0]?.text?.content || '',
  }));

  return {
    posts,
    nextCursor: response.next_cursor,
    hasMore: response.has_more,
  };
}