import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function getBlogPosts() {
  const databaseId = process.env.NOTION_DATABASE_ID;

  const response = await notion.databases.query({
    database_id: databaseId,
  });

  return response.results.map((page) => ({
    id: page.id,
    title: page.properties['title']?.title?.[0]?.text?.content || 'Untitled',
    year: page.properties['year']?.rich_text?.[0]?.text?.content || '',
    ratings: page.properties['ratings']?.rich_text?.[0]?.text?.content || '',
    poster: page.properties['poster']?.rich_text?.[0]?.text?.content || '',
  }));
}
