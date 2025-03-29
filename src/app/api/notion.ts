import { NextApiRequest, NextApiResponse } from 'next';
import { getBlogPosts } from '../data/notion'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const posts = await getBlogPosts();
    res.status(200).json(posts);
  }