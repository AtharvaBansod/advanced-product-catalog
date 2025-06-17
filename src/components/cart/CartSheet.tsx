// 'use client';

// import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
// import { useCart } from '@/contexts/CartContext';
// import { CartItem } from './CartItem';
// import Link from 'next/link';
// import { ShoppingBag } from 'lucide-react';

// export const CartSheet = () => {
//   const { items, totalItems, totalPrice, clearCart } = useCart();

//   if (items.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full text-center">
//         <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
//         <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
//         <p className="text-muted-foreground mb-4">Add some products to get started</p>
//         <Link href="/">
//           <Button>Continue Shopping</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full">
//       <SheetHeader>
//         <SheetTitle>Shopping Cart ({totalItems} items)</SheetTitle>
//       </SheetHeader>
      
//       <div className="flex-1 overflow-y-auto py-4">
//         <div className="space-y-4">
//           {items.map((item) => (
//             <CartItem key={item.id} item={item} />
//           ))}
//         </div>
//       </div>

//       <div className="border-t pt-4 space-y-4">
//         <div className="flex items-center justify-between text-lg font-semibold">
//           <span>Total:</span>
//           <span>${totalPrice.toFixed(2)}</span>
//         </div>
        
//         <div className="space-y-2">
//           <Link href="/cart" className="block">
//             <Button className="w-full" size="lg">
//               View Cart
//             </Button>
//           </Link>
          
//           <Button 
//             variant="outline" 
//             className="w-full" 
//             onClick={clearCart}
//             size="sm"
//           >
//             Clear Cart
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };


// components/cart/CartSheet.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const CartSheet = () => {
  const { cartItems, totalItems, removeFromCart, clearCart } = useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.discountedPrice * item.quantity), 
    0
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground">Your cart is empty</p>
            <Link href="/">
              <Button className="mt-4">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    ${item.discountedPrice.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {cartItems.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Total</span>
            <span className="font-bold">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={clearCart}
            >
              Clear
            </Button>
            <Link href="/cart" className="flex-1">
              <Button className="w-full">Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};