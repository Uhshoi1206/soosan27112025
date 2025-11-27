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

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  placeholder = "Tìm kiếm xe, tin tức...",
  className,
  onResultClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    const searchContent = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setIsOpen(true);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchContent, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

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
            if (searchTerm.trim() && results.length > 0) {
              setIsOpen(true);
            }
          }}
          className="pl-10 pr-4"
        />
      </form>

      {isOpen && searchTerm.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm">Đang tìm kiếm...</p>
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
