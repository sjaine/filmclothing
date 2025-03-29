import { getBlogPosts } from '@/app/data/notion';
import MovieHome from './components/MovieHome'

export default async function Home() {
  const posts = await getBlogPosts();

  return <MovieHome posts={posts} />;
}
