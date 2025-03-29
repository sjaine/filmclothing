import { Client } from '@notionhq/client';

const notion = new Client({ auth: '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' });

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
