'use client';

import { ProductCard } from './ProductCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export const ProductGrid = ({ products, loading = false }: ProductGridProps) => {
  if ((loading && products.length === 0 )|| products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px] ">
        <LoadingSpinner size="lg" />
      </div>
    );
  }


  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 dark:bg-black dark:text-white">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
      {loading && (
        <div className="col-span-full flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      )}
    </div>
  );
};