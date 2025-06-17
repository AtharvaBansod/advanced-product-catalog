
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

const ITEMS_PER_PAGE = 8;
const INITIAL_LOAD_COUNT = 8; 

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
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

  
  const loadProducts = useCallback(async () => {
    try {
      let result;
      if (filters.category) {
        
        result = await fetchProductsByCategory(filters.category);
        setAllProducts(result.products);
        setTotalProducts(result.products.length);
        setHasMore(false); 
      } else {
        
        if (isMobile) {
          
          result = await fetchProducts(0, INITIAL_LOAD_COUNT);
          setAllProducts(result.products);
          setHasMore(result.products.length === INITIAL_LOAD_COUNT);
        } else {
          
          result = await fetchProducts(0, 100); 
          setAllProducts(result.products);
        }
        setTotalProducts(result.total);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }, [fetchProducts, fetchProductsByCategory, filters.category, isMobile]);

 
  const loadMoreProducts = useCallback(async () => {
    if (!hasMore || loading || filters.category) return;
    
    try {
      const result = await fetchProducts(allProducts.length, ITEMS_PER_PAGE);
      setAllProducts(prev => [...prev, ...result.products]);
      setHasMore(result.products.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error loading more products:', error);
    }
  }, [allProducts.length, fetchProducts, filters.category, hasMore, loading]);

  
  const { isFetching } = useInfiniteScroll({
    fetchMore: loadMoreProducts,
    hasMore: hasMore && isMobile && !filters.category,
    threshold: 200
  });

  useEffect(() => {
    let filtered = [...allProducts];


    filtered = filtered.filter(
      product => product.price >= filters.priceRange[0] && 
                product.price <= filters.priceRange[1]
    );


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
    setCurrentPage(1); 
  }, [allProducts, filters]);


  useEffect(() => {
    if (isMobile && !filters.category) {
    
      setDisplayedProducts(filteredProducts);
    } else {
      
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      setDisplayedProducts(filteredProducts.slice(start, end));
    }
  }, [currentPage, filteredProducts, isMobile, filters.category]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8 ">
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
             
              {!isMobile && totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </p>
          </div>

          <ProductGrid 
            products={displayedProducts} 
            loading={loading || (isMobile && isFetching)} 
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

          
          {isMobile && isFetching && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}