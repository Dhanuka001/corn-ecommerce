import { apiRequest } from "./api";
import type { FavoriteItem } from "@/types/favorites";

type FavoritesResponse = { items: FavoriteItem[] };

export async function fetchFavorites(): Promise<FavoriteItem[]> {
  const { items } = await apiRequest<FavoritesResponse>("/favorites", {
    method: "GET",
  });
  return items;
}

export async function addFavorite(productId: string): Promise<FavoriteItem[]> {
  const { items } = await apiRequest<FavoritesResponse>("/favorites", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
  return items;
}

export async function removeFavorite(
  productId: string,
): Promise<FavoriteItem[]> {
  const { items } = await apiRequest<FavoritesResponse>(
    `/favorites/${productId}`,
    {
      method: "DELETE",
    },
  );
  return items;
}
