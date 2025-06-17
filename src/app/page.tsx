'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, FilterOptions } from '@/types';
import { useApiContext } from '@/contexts/ApiContext';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { Pagination } from '@/components/common/Pagination';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const ITEMS_PER_PAGE = 5;

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    priceRange: [0, 2000],
    rating: 0,
    sortBy: 'default',
  });
  const [isMobile, setIsMobile] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { fetchProducts, fetchProductsByCategory, loading } = useApiContext();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadProducts = useCallback(async (page = 1, append = false) => {
    try {
      let result;
      if (filters.category) {
        result = await fetchProductsByCategory(filters.category);
      } else {
        result = await fetchProducts(page, ITEMS_PER_PAGE);
      }

      if (append) {
        setProducts(prev => [...prev, ...result.products]);
      } else {
        setProducts(result.products);
      }
      
      setTotalProducts(result.total);
      setHasMore(result.products.length === ITEMS_PER_PAGE && (page * ITEMS_PER_PAGE) < result.total);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }, [fetchProducts, fetchProductsByCategory, filters.category]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    const nextPage = Math.floor(products.length / ITEMS_PER_PAGE) + 1;
    await loadProducts(nextPage, true);
  }, [hasMore, loading, products.length, loadProducts]);

  const { isFetching } = useInfiniteScroll({
    fetchMore: loadMore,
    hasMore: hasMore && isMobile,
  });

  useEffect(() => {
    loadProducts(1, false);
    setCurrentPage(1);
  }, [filters.category]);

  useEffect(() => {
    let filtered = [...products];

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000) {
      filtered = filtered.filter(
        product => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      );
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 2000],
      rating: 0,
      sortBy: 'default',
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginatedProducts = isMobile 
    ? filteredProducts 
    : filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block">
          <ProductFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="mb-4">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Products</h1>
            <p className="text-muted-foreground">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
            </p>
          </div>

          <ProductGrid 
            products={paginatedProducts} 
            loading={loading || isFetching} 
          />

          {!isMobile && totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}