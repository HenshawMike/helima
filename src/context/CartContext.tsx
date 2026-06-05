'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

// Minimal shape persisted to localStorage (no prices — prices come from Firestore)
interface PersistedCartItem {
  id: string;
  name: string;
  quantity: number;
  imageUrl: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  /** True when a background sync detected price changes */
  pricesUpdated: boolean;
  /** Dismiss the price-change notification */
  dismissPriceNotice: () => void;
  /** Whether a price sync is currently in progress */
  isSyncing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const SYNC_INTERVAL_MS = 60_000; // re-sync every 60 seconds

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pricesUpdated, setPricesUpdated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch live prices from Firestore for all cart items ────────
  const syncPricesFromFirestore = useCallback(async (currentItems: CartItem[]) => {
    if (!db || currentItems.length === 0) return currentItems;

    setIsSyncing(true);
    let hasChanges = false;
    const updatedItems: CartItem[] = [];

    for (const item of currentItems) {
      try {
        const productDoc = await getDoc(doc(db, 'products', item.id));

        if (!productDoc.exists()) {
          // Product deleted — remove from cart
          hasChanges = true;
          continue;
        }

        const data = productDoc.data();

        // Product deactivated — remove from cart
        if (data.isActive === false) {
          hasChanges = true;
          continue;
        }

        const livePrice = data.price as number;
        const liveName = (data.name as string) || item.name;
        const liveImage = (data.imageUrl as string) || item.imageUrl;

        if (
          livePrice !== item.price ||
          liveName !== item.name ||
          liveImage !== item.imageUrl
        ) {
          hasChanges = true;
        }

        updatedItems.push({
          ...item,
          price: livePrice,
          name: liveName,
          imageUrl: liveImage,
        });
      } catch (err) {
        // Network error — keep the item as-is so the cart isn't destroyed offline
        console.warn(`Failed to sync price for product ${item.id}:`, err);
        updatedItems.push(item);
      }
    }

    setIsSyncing(false);

    if (hasChanges) {
      setPricesUpdated(true);
      return updatedItems;
    }

    return null; // null = no changes
  }, []);

  // ── Load from localStorage, then sync ─────────────────────────
  useEffect(() => {
    const savedCart = localStorage.getItem('helima_cart');
    if (savedCart) {
      try {
        const parsed: CartItem[] = JSON.parse(savedCart);
        setItems(parsed);

        // Immediately sync prices against Firestore
        syncPricesFromFirestore(parsed).then((result) => {
          if (result) {
            setItems(result);
          }
        });
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }
    setIsInitialized(true);
  }, [syncPricesFromFirestore]);

  // ── Persist to localStorage (only IDs + quantities; prices for display cache) ──
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('helima_cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  // ── Periodic sync ─────────────────────────────────────────────
  useEffect(() => {
    if (!isInitialized) return;

    syncTimerRef.current = setInterval(() => {
      setItems((current) => {
        if (current.length === 0) return current;
        // Fire async sync; update state when done
        syncPricesFromFirestore(current).then((result) => {
          if (result) setItems(result);
        });
        return current;
      });
    }, SYNC_INTERVAL_MS);

    return () => {
      if (syncTimerRef.current) clearInterval(syncTimerRef.current);
    };
  }, [isInitialized, syncPricesFromFirestore]);

  // ── Also sync when the tab becomes visible again ──────────────
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setItems((current) => {
          if (current.length === 0) return current;
          syncPricesFromFirestore(current).then((result) => {
            if (result) setItems(result);
          });
          return current;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [syncPricesFromFirestore]);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  const dismissPriceNotice = () => setPricesUpdated(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        pricesUpdated,
        dismissPriceNotice,
        isSyncing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
