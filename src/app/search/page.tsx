
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApiContext } from '@/contexts/ApiContext';
import { ProductGrid } from '@/components/product/ProductGrid';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Product, SearchResult } from '@/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { searchProducts, loading } = useApiContext();
  const [results, setResults] = useState<SearchResult | null>(null);


  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        try {
          const data = await searchProducts(query);
          setResults(data);
        } catch (error) {
          console.error('Search failed:', error);
        }
      };
      fetchResults();
    }
  }, [query, searchProducts]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Search Results for "${query}"` : 'Search Products'}
      </h1>
      
      {loading && !results ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <ProductGrid 
          products={results?.products || []} 
          loading={loading}
        />
      )}
    </div>
  );
}