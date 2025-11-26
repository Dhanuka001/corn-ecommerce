"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  addCartItem,
  fetchCart,
  removeCartItem,
  updateCartItemQuantity,
} from "@/lib/cart-api";
import type { Cart } from "@/types/cart";
import { useNotifications } from "@/context/notification-context";
import { useAuth } from "./auth-context";

type CartContextValue = {
  cart: Cart | null;
  loading: boolean;
  pending: boolean;
  refresh: () => Promise<void>;
  addItem: (payload: {
    productId: string;
    variantId?: string | null;
    qty?: number;
  }) => Promise<void>;
  updateQuantity: (itemId: string, qty: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { notifyError, notifySuccess } = useNotifications();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const initializedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  const refresh = useCallback(async ({ force = false } = {}) => {
    if (!force && initializedRef.current) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const nextCart = await fetchCart();
      setCart(nextCart);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load cart.";
      notifyError("Cart unavailable", message);
      setCart(null);
    } finally {
      initializedRef.current = true;
      setLoading(false);
    }
  }, [notifyError]);

  useEffect(() => {
    if (authLoading) return;
    if (initializedRef.current && lastUserIdRef.current === (user?.id ?? null)) {
      return;
    }
    initializedRef.current = true;
    lastUserIdRef.current = user?.id ?? null;
    void refresh({ force: true });
  }, [authLoading, user?.id, refresh]);

  const addItem = useCallback(
    async ({
      productId,
      variantId,
      qty = 1,
    }: {
      productId: string;
      variantId?: string | null;
      qty?: number;
    }) => {
      setPending(true);
      try {
        const nextCart = await addCartItem({
          productId,
          variantId,
          qty,
        });
        setCart(nextCart);
        const quantityLabel =
          (nextCart.summary?.totalQuantity ?? qty) > 1 ? "items" : "item";
        notifySuccess("Added to cart", `${qty} ${quantityLabel} added.`);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to add to cart.";
        notifyError("Add to cart failed", message);
      } finally {
        setPending(false);
      }
    },
    [notifyError, notifySuccess],
  );

  const updateQuantity = useCallback(
    async (itemId: string, qty: number) => {
      setPending(true);
      try {
        const nextCart = await updateCartItemQuantity({ itemId, qty });
        setCart(nextCart);
        notifySuccess("Quantity updated", "Cart updated successfully.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to update quantity.";
        notifyError("Update failed", message);
      } finally {
        setPending(false);
      }
    },
    [notifyError, notifySuccess],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      setPending(true);
      try {
        const nextCart = await removeCartItem(itemId);
        setCart(nextCart);
        notifySuccess("Removed", "Item removed from cart.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to remove item.";
        notifyError("Remove failed", message);
      } finally {
        setPending(false);
      }
    },
    [notifyError, notifySuccess],
  );

  const value = useMemo(
    () => ({ cart, loading, pending, refresh, addItem, updateQuantity, removeItem }),
    [addItem, cart, loading, pending, refresh, removeItem, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
