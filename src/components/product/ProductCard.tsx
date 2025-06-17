'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard = ({ product, index }: ProductCardProps) => {
  const { addToCart, isInCart } = useCart();
  const [loading, setLoading] = useState(false);

   const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      await addToCart(product); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link href={`/product/${product.id}`}>
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {product.discountPercentage > 0 && (
              <Badge className="absolute top-2 left-2 bg-red-500">
                -{Math.round(product.discountPercentage)}%
              </Badge>
            )}
            {product.stock < 10 && product.stock > 0 && (
              <Badge variant="secondary" className="absolute top-2 right-2">
                Only {product.stock} left
              </Badge>
            )}
          </div>
          
          <CardContent className="flex-1 p-4">
            <h3 className="font-semibold line-clamp-2 mb-2">{product.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {product.description}
            </p>
            
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">
                ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.price}
                </span>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0">
            <Button 
              onClick={handleAddToCart}
               disabled={loading || product.stock === 0}
              className="w-full"
              size="sm"
            >
               {loading ? (
                <LoadingSpinner size="sm" />
              ) : isInCart(product.id) ? (
                <>
                 <Check className="h-4 w-4 mr-2" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};