// 'use client';

// import Link from 'next/link';
// import { ShoppingCart, Search } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// import { useCart } from '@/contexts/CartContext';
// import { CartSheet } from '@/components/cart/CartSheet';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useDebounce } from '@/hooks/useDebounce';

// export const Navbar = () => {
//   const { totalItems } = useCart();
//   const [searchQuery, setSearchQuery] = useState('');
//   const router = useRouter();
//   const debouncedSearchQuery = useDebounce(searchQuery, 300);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
//     }
//   };

//   return (
//     <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container mx-auto px-4">
//         <div className="flex h-14 items-center justify-between">
//           <Link href="/" className="flex items-center space-x-2">
//             <span className="text-xl font-bold">ShopHub</span>
//           </Link>

//           <div className="flex items-center space-x-4 flex-1 max-w-md mx-4">
//             <form onSubmit={handleSearch} className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search products..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-8"
//                 />
//               </div>
//             </form>
//           </div>

//           <div className="flex items-center space-x-2">
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button variant="outline" size="sm" className="relative">
//                   <ShoppingCart className="h-4 w-4" />
//                   {totalItems > 0 && (
//                     <Badge 
//                       variant="destructive" 
//                       className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
//                     >
//                       {totalItems}
//                     </Badge>
//                   )}
//                 </Button>
//               </SheetTrigger>
//               <SheetContent>
//                 <CartSheet />
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };


// components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { ShoppingCart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { CartSheet } from '@/components/cart/CartSheet';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const Navbar = () => {
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">ShopHub</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </form>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
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
            <SheetContent>
              <CartSheet />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};