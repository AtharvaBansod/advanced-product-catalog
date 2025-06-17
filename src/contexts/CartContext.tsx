// 'use client';

// import React, { createContext, useContext, useReducer, useEffect } from 'react';
// import { Product, CartItem } from '@/types';

// interface CartState {
//   items: CartItem[];
//   totalItems: number;
//   totalPrice: number;
// }

// type CartAction =
//   | { type: 'ADD_ITEM'; payload: Product }
//   | { type: 'REMOVE_ITEM'; payload: number }
//   | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
//   | { type: 'CLEAR_CART' }
//   | { type: 'LOAD_CART'; payload: CartState };

// interface CartContextType extends CartState {
//   addToCart: (product: Product) => void;
//   removeFromCart: (productId: number) => void;
//   updateQuantity: (productId: number, quantity: number) => void;
//   clearCart: () => void;
//   isInCart: (productId: number) => boolean;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// const cartReducer = (state: CartState, action: CartAction): CartState => {
//   switch (action.type) {
//     case 'ADD_ITEM': {
//       const existingItem = state.items.find(item => item.id === action.payload.id);
      
//       if (existingItem) {
//         const updatedItems = state.items.map(item =>
//           item.id === action.payload.id
//             ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
//             : item
//         );
//         return {
//           ...state,
//           items: updatedItems,
//           totalItems: state.totalItems + 1,
//           totalPrice: state.totalPrice + action.payload.price,
//         };
//       }

//       const newItem: CartItem = {
//         id: action.payload.id,
//         title: action.payload.title,
//         price: action.payload.price,
//         quantity: 1,
//         total: action.payload.price,
//         discountPercentage: action.payload.discountPercentage,
//         discountedPrice: action.payload.price * (1 - action.payload.discountPercentage / 100),
//         thumbnail: action.payload.thumbnail,
//       };

//       return {
//         ...state,
//         items: [...state.items, newItem],
//         totalItems: state.totalItems + 1,
//         totalPrice: state.totalPrice + action.payload.price,
//       };
//     }

//     case 'REMOVE_ITEM': {
//       const itemToRemove = state.items.find(item => item.id === action.payload);
//       if (!itemToRemove) return state;

//       return {
//         ...state,
//         items: state.items.filter(item => item.id !== action.payload),
//         totalItems: state.totalItems - itemToRemove.quantity,
//         totalPrice: state.totalPrice - itemToRemove.total,
//       };
//     }

//     case 'UPDATE_QUANTITY': {
//       const { id, quantity } = action.payload;
//       if (quantity <= 0) {
//         return cartReducer(state, { type: 'REMOVE_ITEM', payload: id });
//       }

//       const updatedItems = state.items.map(item => {
//         if (item.id === id) {
//           const newTotal = quantity * item.price;
//           return { ...item, quantity, total: newTotal };
//         }
//         return item;
//       });

//       const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
//       const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.total, 0);

//       return {
//         ...state,
//         items: updatedItems,
//         totalItems: newTotalItems,
//         totalPrice: newTotalPrice,
//       };
//     }

//     case 'CLEAR_CART':
//       return {
//         items: [],
//         totalItems: 0,
//         totalPrice: 0,
//       };

//     case 'LOAD_CART':
//       return action.payload;

//     default:
//       return state;
//   }
// };

// const initialState: CartState = {
//   items: [],
//   totalItems: 0,
//   totalPrice: 0,
// };

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [state, dispatch] = useReducer(cartReducer, initialState);

//   useEffect(() => {
//     const savedCart = localStorage.getItem('cart');
//     if (savedCart) {
//       try {
//         const parsedCart = JSON.parse(savedCart);
//         dispatch({ type: 'LOAD_CART', payload: parsedCart });
//       } catch (error) {
//         console.error('Error loading cart from localStorage:', error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(state));
//   }, [state]);

//   const addToCart = (product: Product) => {
//     dispatch({ type: 'ADD_ITEM', payload: product });
//   };

//   const removeFromCart = (productId: number) => {
//     dispatch({ type: 'REMOVE_ITEM', payload: productId });
//   };

//   const updateQuantity = (productId: number, quantity: number) => {
//     dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
//   };

//   const clearCart = () => {
//     dispatch({ type: 'CLEAR_CART' });
//   };

//   const isInCart = (productId: number) => {
//     return state.items.some(item => item.id === productId);
//   };

//   const value: CartContextType = {
//     ...state,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     isInCart,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// contexts/CartContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  isInCart: (productId: number) => boolean;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id 
            ? { 
                ...item, 
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price,
                discountedPrice: (item.quantity + 1) * (item.price * (1 - item.discountPercentage / 100))
              } 
            : item
        );
      }
      const newItem: CartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        total: product.price,
        discountPercentage: product.discountPercentage,
        discountedPrice: product.price * (1 - product.discountPercentage / 100),
        thumbnail: product.thumbnail
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? {
              ...item,
              quantity,
              total: quantity * item.price,
              discountedPrice: quantity * (item.price * (1 - item.discountPercentage / 100))
            }
          : item
      )
    );
  };

  const isInCart = (productId: number) => {
    return cartItems.some(item => item.id === productId);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.discountedPrice, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        totalItems,
        totalPrice,
        addToCart, 
        removeFromCart,
        updateQuantity,
        isInCart, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};