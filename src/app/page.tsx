
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, FilterOptions } from '@/types';
import { useApiContext } from '@/contexts/ApiContext';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const ITEMS_PER_PAGE = 8;

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

  const { fetchProducts, fetchProductsByCategory, loading } = useApiContext();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch products based on filters
  const loadProducts = useCallback(async () => {
    try {
      let result;
      if (filters.category) {
        // When category filter is applied, fetch all products in that category
        result = await fetchProductsByCategory(filters.category);
        setAllProducts(result.products);
        setTotalProducts(result.products.length);
      } else {
        // For initial load or when no category filter, fetch paginated products
        result = await fetchProducts(0, 100); // Fetch first 100 products or adjust as needed
        setAllProducts(result.products);
        setTotalProducts(result.total);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }, [fetchProducts, fetchProductsByCategory, filters.category]);

  // Apply all filters and sorting
  useEffect(() => {
    let filtered = [...allProducts];

    // Apply price range filter
    filtered = filtered.filter(
      product => product.price >= filters.priceRange[0] && 
                product.price <= filters.priceRange[1]
    );

    // Apply minimum rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // Apply sorting
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
      default:
        // Default sorting (perhaps by ID or as returned from API)
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page whenever filters change
  }, [allProducts, filters]);

  // Update displayed products for current page
  useEffect(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setDisplayedProducts(filteredProducts.slice(start, end));
  }, [currentPage, filteredProducts]);

  // Load products when component mounts or filters change
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
              Showing {displayedProducts.length} of {filteredProducts.length} products
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </p>
          </div>

          <ProductGrid products={displayedProducts} loading={loading} />

          {totalPages > 1 && (
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