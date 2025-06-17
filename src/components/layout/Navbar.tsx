
'use client';

import Link from 'next/link';
import { ShoppingCart, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { CartSheet } from '@/components/cart/CartSheet';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useApiContext } from '@/contexts/ApiContext';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const Navbar = () => {
    const { totalItems } = useCart();
    const { searchProducts } = useApiContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();
    const debouncedSearch = useDebounce(searchQuery, 300);
    const searchRef = useRef<HTMLDivElement>(null);
    const isNavigatingRef = useRef(false);
    const { isDark, toggleDark } = useTheme();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            isNavigatingRef.current = true;
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        isNavigatingRef.current = true;
        setSearchQuery(suggestion);
        setShowSuggestions(false);
        router.push(`/search?q=${encodeURIComponent(suggestion)}`);
    };

    useEffect(() => {
        if (debouncedSearch.trim() && !isNavigatingRef.current) {
            const fetchSuggestions = async () => {
                try {
                    const result = await searchProducts(debouncedSearch);
                    const productTitles = result.products.map(product => product.title);
                    setSuggestions(productTitles.slice(0, 5));
                    setShowSuggestions(true);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                    setSuggestions([]);
                }
            };
            fetchSuggestions();
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [debouncedSearch, searchProducts]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node) && !isNavigatingRef.current) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    useEffect(() => {
        const resetNavigationFlag = () => {
            isNavigatingRef.current = false;
        };

        window.addEventListener('popstate', resetNavigationFlag);
        return () => {
            window.removeEventListener('popstate', resetNavigationFlag);
        };
    }, []);

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-14 items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold">ShopHub</span>
                    </Link>

                    <div className="flex-1 max-w-md mx-4 relative" ref={searchRef}>
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    className="pl-8"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSuggestions([]);
                                        }}
                                        className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </form>

                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full bg-popover text-popover-foreground shadow-lg rounded-md border">
                                <ul className="py-1">
                                    {suggestions.map((suggestion, index) => (
                                        <li key={index}>
                                            <button
                                                type="button"
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                                            >
                                                {suggestion}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

<div className='flex gap-2 '>


                    <Button variant="ghost" size="sm" onClick={toggleDark} className='hover:cursor-pointer'>
                        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>


                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="relative hover:cursor-pointer">
                                <ShoppingCart className="h-4 w-4 " />
                                {totalItems > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                    >
                                        {totalItems}
                                    </Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="px-5">
                            <CartSheet />
                        </SheetContent>
                    </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
};