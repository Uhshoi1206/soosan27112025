import React, { useMemo } from 'react';
import { Package, FileText } from 'lucide-react';
import TruckItem from './TruckItem';
import { Card, CardContent, CardHeader } from './ui/card';
import type { Truck } from '@/models/TruckTypes';
import type { BlogPost } from '@/models/BlogPost';

interface SearchResultsProps {
  products: Truck[];
  blogPosts: BlogPost[];
  searchQuery: string;
}

const removeVietnameseTones = (str: string): string => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

const SearchResults: React.FC<SearchResultsProps> = ({ products, blogPosts, searchQuery }) => {
  console.log('[SearchResults] Received:', {
    productsCount: products?.length || 0,
    blogPostsCount: blogPosts?.length || 0,
    searchQuery
  });

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;

    const query = removeVietnameseTones(searchQuery);
    console.log('[SearchResults] Filtering products with query:', { original: searchQuery, normalized: query });

    return products.filter(product => {
      const name = removeVietnameseTones(product.name || '');
      const brand = removeVietnameseTones(product.brand || '');
      const description = removeVietnameseTones(product.description || '');
      const model = removeVietnameseTones(product.model || '');

      return name.includes(query) ||
        brand.includes(query) ||
        description.includes(query) ||
        model.includes(query);
    });
  }, [products, searchQuery]);

  const filteredBlogPosts = useMemo(() => {
    if (!searchQuery) return blogPosts;

    const query = removeVietnameseTones(searchQuery);
    return blogPosts.filter(post => {
      const title = removeVietnameseTones(post.title || '');
      const description = removeVietnameseTones(post.description || '');
      const excerpt = removeVietnameseTones(post.excerpt || '');

      return title.includes(query) ||
        description.includes(query) ||
        excerpt.includes(query);
    });
  }, [blogPosts, searchQuery]);

  const totalResults = filteredProducts.length + filteredBlogPosts.length;

  console.log('[SearchResults] Filtered results:', {
    productsFound: filteredProducts.length,
    blogsFound: filteredBlogPosts.length,
    total: totalResults
  });

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-gray-700">
          Tìm thấy <span className="font-bold text-primary">{totalResults}</span> kết quả
          {filteredProducts.length > 0 && (
            <span> ({filteredProducts.length} sản phẩm</span>
          )}
          {filteredProducts.length > 0 && filteredBlogPosts.length > 0 && ', '}
          {filteredBlogPosts.length > 0 && (
            <span>{filteredBlogPosts.length} tin tức</span>
          )}
          {(filteredProducts.length > 0 || filteredBlogPosts.length > 0) && ')'}
        </p>
      </div>

      {totalResults === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Package className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Không tìm thấy kết quả
          </h3>
          <p className="text-gray-500">
            Không có sản phẩm hoặc tin tức nào phù hợp với từ khóa "{searchQuery}"
          </p>
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-gray-800">
              Sản phẩm ({filteredProducts.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <TruckItem key={product.id} truck={product} />
            ))}
          </div>
        </div>
      )}

      {filteredBlogPosts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">
              Tin tức ({filteredBlogPosts.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogPosts.map((post) => (
              <Card key={post.slug} className="hover:shadow-lg transition-shadow">
                <a href={`/${post.category}/${post.slug}`}>
                  {post.image && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {post.excerpt || post.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(post.publishDate).toLocaleDateString('vi-VN')}</span>
                      <span className="text-primary hover:underline">Đọc thêm →</span>
                    </div>
                  </CardContent>
                </a>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
