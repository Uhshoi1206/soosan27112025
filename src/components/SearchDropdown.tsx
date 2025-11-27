import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Package } from 'lucide-react';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  type: 'product' | 'blog';
  url: string;
  excerpt?: string;
}

interface SearchDropdownProps {
  placeholder?: string;
  className?: string;
  onResultClick?: () => void;
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

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  placeholder = "Tìm kiếm xe, tin tức...",
  className,
  onResultClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search data once on mount
  useEffect(() => {
    const loadSearchData = async () => {
      try {
        // Try to get data from window object (injected by Astro)
        if ((window as any).__SEARCH_DATA__) {
          console.log('[SearchDropdown] Using cached search data');
          setSearchData((window as any).__SEARCH_DATA__);
          return;
        }

        // Fallback: fetch from API
        console.log('[SearchDropdown] Fetching search data from API...');
        const response = await fetch('/api/search-data.json');
        console.log('[SearchDropdown] API response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('[SearchDropdown] Loaded data:', {
            products: data.products?.length || 0,
            blogs: data.blogs?.length || 0
          });
          setSearchData(data);
          (window as any).__SEARCH_DATA__ = data;
        } else {
          console.error('[SearchDropdown] API returned non-OK status:', response.status);
        }
      } catch (error) {
        console.error('[SearchDropdown] Failed to load search data:', error);
      }
    };

    loadSearchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchContent = () => {
      if (!searchTerm.trim() || searchTerm.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      if (!searchData) {
        console.log('[SearchDropdown] Search data not loaded yet');
        setIsLoading(true);
        setIsOpen(true);
        return;
      }

      setIsLoading(true);
      setIsOpen(true);

      try {
        const query = removeVietnameseTones(searchTerm.trim());
        console.log('[SearchDropdown] Searching for:', { original: searchTerm, normalized: query });
        const foundResults: SearchResult[] = [];

        // Search products
        if (searchData.products) {
          console.log('[SearchDropdown] Searching in', searchData.products.length, 'products');
          searchData.products.forEach((product: any) => {
            const name = removeVietnameseTones(product.name || '');
            const brand = removeVietnameseTones(product.brand || '');
            const model = removeVietnameseTones(product.model || '');
            const description = removeVietnameseTones(product.description || '');

            if (name.includes(query) ||
                brand.includes(query) ||
                model.includes(query) ||
                description.includes(query)) {
              foundResults.push({
                id: product.id,
                title: product.name,
                type: 'product',
                url: `/${product.type}/${product.slug}`,
                excerpt: product.description?.substring(0, 100)
              });
            }
          });
        }

        // Search blogs
        if (searchData.blogs) {
          console.log('[SearchDropdown] Searching in', searchData.blogs.length, 'blogs');
          searchData.blogs.forEach((blog: any) => {
            const title = removeVietnameseTones(blog.title || '');
            const description = removeVietnameseTones(blog.description || '');
            const excerpt = removeVietnameseTones(blog.excerpt || '');

            if (title.includes(query) ||
                description.includes(query) ||
                excerpt.includes(query)) {
              foundResults.push({
                id: blog.id,
                title: blog.title,
                type: 'blog',
                url: `/${blog.category}/${blog.slug}`,
                excerpt: blog.excerpt?.substring(0, 100) || blog.description?.substring(0, 100)
              });
            }
          });
        }

        // Sort results - exact matches first
        foundResults.sort((a, b) => {
          const aExactMatch = removeVietnameseTones(a.title) === query;
          const bExactMatch = removeVietnameseTones(b.title) === query;
          if (aExactMatch && !bExactMatch) return -1;
          if (!aExactMatch && bExactMatch) return 1;
          return 0;
        });

        console.log('[SearchDropdown] Found', foundResults.length, 'results');
        setResults(foundResults.slice(0, 10));
      } catch (error) {
        console.error('[SearchDropdown] Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchContent, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
      setIsOpen(false);
    }
  };

  const handleResultClick = (url: string) => {
    window.location.href = url;
    setIsOpen(false);
    onResultClick?.();
  };

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (searchTerm.trim().length >= 2 && results.length > 0) {
              setIsOpen(true);
            }
          }}
          className="pl-10 pr-4"
        />
      </form>

      {isOpen && searchTerm.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm">Đang tìm kiếm...</p>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="p-2 text-xs text-gray-500 font-semibold border-b">
                Tìm thấy {results.length} kết quả
              </div>
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result.url)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-start gap-3"
                >
                  <div className="flex-shrink-0 mt-1">
                    {result.type === 'product' ? (
                      <Package className="h-5 w-5 text-primary" />
                    ) : (
                      <FileText className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {result.title}
                    </div>
                    {result.excerpt && (
                      <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {result.excerpt}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {result.type === 'product' ? 'Sản phẩm' : 'Tin tức'}
                    </div>
                  </div>
                </button>
              ))}
              <button
                onClick={() => handleSubmit(new Event('submit') as any)}
                className="w-full px-4 py-3 text-center text-sm text-primary hover:bg-gray-50 font-medium border-t"
              >
                Xem tất cả kết quả cho "{searchTerm}"
              </button>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p className="text-sm">Không tìm thấy kết quả cho "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
