'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, ProductsResponse, SearchResult, ApiResponse } from '@/types';


interface ApiContextType {
  fetchProducts: (page?: number, limit?: number) => Promise<ProductsResponse>;
  fetchProductById: (id: number) => Promise<Product>;
  searchProducts: (query: string) => Promise<SearchResult>;
  fetchProductsByCategory: (category: string) => Promise<ProductsResponse>;
  fetchCategories: () => Promise<string[]>;
  loading: boolean;
  error: string | null;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('common...useApiContext must be used bla bla bla..');
  }
  return context;
};

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = useCallback(async <T,>(requestFn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestFn();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async (page = 1, limit = 20): Promise<ProductsResponse> => {
    return handleRequest(async () => {
      const skip = (page - 1) * limit;
      const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    });
  }, [handleRequest]);

  const fetchProductById = useCallback(async (id: number): Promise<Product> => {
    return handleRequest(async () => {
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json();
    });
  }, [handleRequest]);

  const searchProducts = useCallback(async (query: string): Promise<SearchResult> => {
    return handleRequest(async () => {
      const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search products');
      return response.json();
    });
  }, [handleRequest]);

  const fetchProductsByCategory = useCallback(async (category: string): Promise<ProductsResponse> => {
    return handleRequest(async () => {
      const response = await fetch(`https://dummyjson.com/products/category/${category}`);
      if (!response.ok) throw new Error('Failed to fetch products by category');
      return response.json();
    });
  }, [handleRequest]);

  const fetchCategories = useCallback(async (): Promise<string[]> => {
    return handleRequest(async () => {
      const response = await fetch('https://dummyjson.com/products/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    });
  }, [handleRequest]);

  const value: ApiContextType = {
    fetchProducts,
    fetchProductById,
    searchProducts,
    fetchProductsByCategory,
    fetchCategories,
    loading,
    error,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};