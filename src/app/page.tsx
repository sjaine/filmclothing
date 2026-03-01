import { getBlogPosts } from '@/app/data/notion';
import MovieHome from './components/MovieHome'

export const revalidate = 0;

export default async function Home() {
  const data = await getBlogPosts();

  return <MovieHome initialData={data} />;
}