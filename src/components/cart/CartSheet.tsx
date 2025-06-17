
// // components/cart/CartSheet.tsx
// 'use client';

// import { Button } from '@/components/ui/button';
// import { useCart } from '@/contexts/CartContext';
// import { X } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';

// export const CartSheet = () => {
//   const { cartItems, totalItems, removeFromCart, clearCart } = useCart();

//   const totalPrice = cartItems.reduce(
//     (sum, item) => sum + (item.discountedPrice * item.quantity), 
//     0
//   );

//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex-1 overflow-y-auto">
//         {cartItems.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-full text-center">
//             <p className="text-muted-foreground">Your cart is empty</p>
//             <Link href="/">
//               <Button className="mt-4">Continue Shopping</Button>
//             </Link>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {cartItems.map(item => (
//               <div key={item.id} className="flex items-center gap-4 border-b pb-4">
//                 <div className="relative h-16 w-16 rounded-md overflow-hidden">
//                   <Image
//                     src={item.thumbnail}
//                     alt={item.title}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="font-medium">{item.title}</h3>
//                   <p className="text-sm text-muted-foreground">
//                     ${item.discountedPrice.toFixed(2)} x {item.quantity}
//                   </p>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => removeFromCart(item.id)}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
      
//       {cartItems.length > 0 && (
//         <div className="border-t pt-4">
//           <div className="flex justify-between items-center mb-4">
//             <span className="font-medium">Total</span>
//             <span className="font-bold">${totalPrice.toFixed(2)}</span>
//           </div>
//           <div className="flex gap-2">
//             <Button 
//               variant="outline" 
//               className="flex-1" 
//               onClick={clearCart}
//             >
//               Clear
//             </Button>
//             <Link href="/cart" className="flex-1">
//               <Button className="w-full">Checkout</Button>
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { CartItem } from './CartItem';

export const CartSheet = () => {
  const { cartItems, totalItems, clearCart, totalPrice } = useCart();

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
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
      
      {cartItems.length > 0 && (
        <div className="border-t pt-4">
             <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Toatl Items</span>
            <span className="font-bold">{totalItems}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Subtotal</span>
            <span className="font-bold">${totalPrice.toFixed(2)}</span>
          </div>
         
          <div className="flex gap-2 pb-3">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={clearCart}
            >
              Clear Cart
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