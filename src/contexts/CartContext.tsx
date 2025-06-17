'use client';

import { createContext, useContext, useState } from 'react';
import { CartItem, Product } from '@/types';
import { useSocket } from './SocketContext';

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
  const { socket, connected } = useSocket();

  const handleAddItem = (product: Product) => {
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

const addToCart = (product: Product): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'development' && socket && connected) {
      socket.emit('check-stock', product.id);
      socket.once('stock-status', ({ productId, inStock }) => {
        if (productId === product.id) {
          if (inStock) {
            handleAddItem(product);
            resolve();
          } else {
            alert('Product is out of stock!');
            reject(new Error('Out of stock'));
          }
        }
      });
    } else {
      handleAddItem(product);
      resolve();
    }
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
