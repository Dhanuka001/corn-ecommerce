"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  addFavorite,
  fetchFavorites,
  removeFavorite,
} from "@/lib/favorites-api";
import type { FavoriteItem } from "@/types/favorites";
import { useNotifications } from "@/context/notification-context";
import { useAuth } from "./auth-context";

type FavoritesContextValue = {
  items: FavoriteItem[];
  loading: boolean;
  pending: boolean;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading, openAuth } = useAuth();
  const { notifyError, notifySuccess } = useNotifications();
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchFavorites();
      setItems(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load favorites.";
      notifyError("Favorites unavailable", message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [notifyError, user]);

  useEffect(() => {
    if (authLoading) return;
    void refresh();
  }, [authLoading, user?.id, refresh]);

  const isFavorite = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items],
  );

  const toggleFavorite = useCallback(
    async (productId: string) => {
      if (!user) {
        openAuth("login");
        return;
      }
      const wasFavorite = isFavorite(productId);
      setPending(true);
      try {
        const nextItems = wasFavorite
          ? await removeFavorite(productId)
          : await addFavorite(productId);
        setItems(nextItems);
        notifySuccess(
          wasFavorite ? "Removed from favorites" : "Saved",
          wasFavorite
            ? "Item removed from favorites."
            : "Saved to your favorites.",
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to update favorites.";
        notifyError("Favorites error", message);
      } finally {
        setPending(false);
      }
    },
    [isFavorite, notifyError, notifySuccess, openAuth, user],
  );

  const remove = useCallback(
    async (productId: string) => {
      if (!user) return;
      setPending(true);
      try {
        const nextItems = await removeFavorite(productId);
        setItems(nextItems);
        notifySuccess("Removed", "Item removed from favorites.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to remove favorite.";
        notifyError("Favorites error", message);
      } finally {
        setPending(false);
      }
    },
    [notifyError, notifySuccess, user],
  );

  const value = useMemo(
    () => ({ items, loading, pending, isFavorite, toggleFavorite, remove, refresh }),
    [isFavorite, items, loading, pending, refresh, remove, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
