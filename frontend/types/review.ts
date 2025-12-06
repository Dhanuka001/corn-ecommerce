export type ReviewUser = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
};

export type ReviewSummary = {
  total: number;
  averageRating: number;
};

export type Review = {
  id: string;
  rating: number;
  title: string;
  body: string;
  images?: string[] | null;
  createdAt: string;
  user: ReviewUser;
  product?: {
    id: string;
    name: string;
    slug: string;
  };
};
