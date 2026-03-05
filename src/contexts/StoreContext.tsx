import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Product, CartItem, Sale } from '@/types';
import { mockProducts, mockSales } from '@/data/mockData';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  sales: Sale[];
  addToCart: (barcode: string) => Product | null;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartTax: number;
  completeSale: (paymentMethod: 'cash' | 'card' | 'mobile', cashierId: string, cashierName: string) => Sale;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<Sale[]>(mockSales);

  const addToCart = useCallback((barcode: string): Product | null => {
    const product = products.find(p => p.barcode === barcode);
    if (!product || product.stock <= 0) return null;

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    return product;
  }, [products]);

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartTax = Math.round(cartTotal * 0.18);

  const completeSale = (paymentMethod: 'cash' | 'card' | 'mobile', cashierId: string, cashierName: string): Sale => {
    const sale: Sale = {
      id: `s${Date.now()}`,
      items: [...cart],
      total: cartTotal + cartTax,
      tax: cartTax,
      cashierId,
      cashierName,
      timestamp: new Date(),
      paymentMethod,
    };

    setSales(prev => [sale, ...prev]);

    // Update stock
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(ci => ci.product.id === p.id);
      if (cartItem) {
        return { ...p, stock: p.stock - cartItem.quantity };
      }
      return p;
    }));

    clearCart();
    return sale;
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...product, id: `p${Date.now()}` }]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      products, cart, sales, addToCart, removeFromCart, updateCartQuantity,
      clearCart, cartTotal, cartTax, completeSale, addProduct, updateProduct, deleteProduct
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
