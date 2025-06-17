'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ShoppingCart, ShoppingBasketIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';
import { useApiContext } from '@/contexts/ApiContext';
import { useRouter } from 'next/navigation';

export default function ProductPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { fetchProductById, fetchProductsByCategory } = useApiContext();
    const { addToCart, isInCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviews, setReviews] = useState<{ rating: number, comment: string }[]>([]);
    const [comment, setComment] = useState('');

    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadSimilarProducts = async () => {
            if (!product) return;
            try {
                const res = await fetchProductsByCategory(product.category);
                const filtered = res.products
                    .filter(p => p.id !== product.id)
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 5);
                setSimilarProducts(filtered);
            } catch (err) {
                console.error('Failed to fetch similar products:', err);
            }
        };
        if (product) loadSimilarProducts();
    }, [product, fetchProductsByCategory]);


    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await fetchProductById(Number(params.id));
                setProduct(data);
                setReviews(data.reviews || []);
            } catch (err) {
                setError('Failed to load product');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [params.id, fetchProductById]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
        }
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (userRating > 0 && product) {
            const newReview = {
                rating: userRating,
                comment: comment.trim()
            };
            setReviews([...reviews, newReview]);
            setComment('');
            setUserRating(0);
        }
    };

    if (loading) return (
        <div className="container mx-auto px-4 py-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
    );

    if (error || !product) return (
        <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-red-500">{error || 'Product not found'}</p>
            <Button onClick={() => router.back()} className="mt-4">
                <ChevronLeft className="mr-2 h-4 w-4" /> Go back
            </Button>
        </div>
    );


    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
        : product.rating;

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                variant="outline"
                onClick={() => router.back()}
                className="mb-6"
            >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to products
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <div>
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-4">
                        <Image
                            src={product.images?.[selectedImage] || product.thumbnail}
                            alt={product.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        {product.discountPercentage > 0 && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                                -{Math.round(product.discountPercentage)}%
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {product.images?.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`relative aspect-square rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
                            >
                                <Image
                                    src={image}
                                    alt={`${product.title} - ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {averageRating.toFixed(1)} ({reviews.length} reviews)
                        </span>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-2xl font-bold">
                                ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                            </span>
                            {product.discountPercentage > 0 && (
                                <span className="text-lg text-muted-foreground line-through">
                                    ${product.price.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {product.stock > 0 ? (
                            <p className="text-green-600">In Stock ({product.stock} available)</p>
                        ) : (
                            <p className="text-red-500">Out of Stock</p>
                        )}
                    </div>

                    <p className="mb-6">{product.description}</p>

                    <div className="flex gap-4 mb-8">
                        <Button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="flex-1"
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {product.stock === 0
                                ? 'Out of Stock'
                                : isInCart(product.id)
                                    ? 'Added to Cart'
                                    : 'Add to Cart'}
                        </Button>
                    </div>


                    <div className="space-y-2 mb-8">
                        <h2 className="text-xl font-semibold">Details</h2>
                        <p><span className="font-medium">Brand:</span> {product.brand}</p>
                        <p><span className="font-medium">Category:</span> {product.category}</p>
                    </div>
                </div>
            </div>


            <div className="mt-12 border-t pt-8">
                <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>


                <div className="mb-8 p-6 bg-muted rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Rate this product</h3>
                    <div className="flex items-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setUserRating(star)}
                                className="focus:outline-none"
                            >
                                <Star
                                    className={`h-8 w-8 ${star <= (hoverRating || userRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmitReview}>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts about this product..."
                            className="w-full p-3 border rounded-md mb-4 min-h-[100px]"
                        />
                        <Button
                            type="submit"
                            disabled={userRating === 0}
                        >
                            Submit Review
                        </Button>
                    </form>
                </div>


                {reviews.length > 0 ? (
                    <div className="space-y-6">
                        {reviews.map((review, index) => (
                            <div key={index} className="border-b pb-6 last:border-0">
                                <div className="flex items-center gap-2 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                {review.comment && (
                                    <p className="text-muted-foreground">{review.comment}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                )}

                {similarProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-6 flex gap-3 items-center">Similar Products - Category wise <ShoppingBasketIcon/> </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {similarProducts.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => router.push(`/product/${item.id}`)}
                                    className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
                                >
                                    <div className="relative aspect-square w-full">
                                        <Image
                                            src={item.thumbnail}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-sm font-medium">{item.title}</h3>
                                        <div className="text-sm text-muted-foreground line-clamp-1">{item.brand}</div>
                                        <div className="flex items-center gap-1 mt-2">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    className={`h-4 w-4 ${star <= Math.round(item.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                            <span className="text-xs ml-1 text-muted-foreground">{item.rating.toFixed(1)}</span>
                                        </div>
                                        <div className="text-primary font-bold mt-1">
                                            ${(item.price * (1 - item.discountPercentage / 100)).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}