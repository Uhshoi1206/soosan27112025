import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q')?.toLowerCase().trim() || '';

  if (!query) {
    return new Response(JSON.stringify({ results: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const [products, blogPosts] = await Promise.all([
      getCollection('products'),
      getCollection('blog')
    ]);

    const productResults = products
      .filter(product =>
        product.data.name.toLowerCase().includes(query) ||
        product.data.brand?.toLowerCase().includes(query) ||
        product.data.description?.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map(product => ({
        id: product.id,
        title: product.data.name,
        type: 'product' as const,
        url: `/${product.data.type}/${product.slug}`,
        excerpt: product.data.description?.substring(0, 100)
      }));

    const blogResults = blogPosts
      .filter(post =>
        post.data.title.toLowerCase().includes(query) ||
        post.data.description?.toLowerCase().includes(query) ||
        post.data.excerpt?.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map(post => ({
        id: post.id,
        title: post.data.title,
        type: 'blog' as const,
        url: `/${post.data.category}/${post.slug}`,
        excerpt: post.data.excerpt?.substring(0, 100) || post.data.description?.substring(0, 100)
      }));

    const results = [...productResults, ...blogResults]
      .sort((a, b) => {
        const aExactMatch = a.title.toLowerCase() === query;
        const bExactMatch = b.title.toLowerCase() === query;
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        return 0;
      })
      .slice(0, 10);

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Search API error:', error);
    return new Response(JSON.stringify({ results: [], error: 'Search failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
