export interface AboutCardType {
  id: number;
  title: string;
  thesis: string;
  icon: React.ReactNode;
}

export interface TestimonialType {
  id: number;
  name: string;
  image?: string;
  text: string;
  likes: number;
  postedAt?: string;
}

export interface MoreFiltersType {
  name: string;
  isActive: boolean;
  elements?: React.ReactNode;
}

export interface appliedFiltersType {
  name: string;
  selectedValues: string[];
}

export interface Filters {
  name: string;
  isActive: boolean;
  isAsc: boolean;
}

export interface Trending {
  id: number;
  title: string;
  description?: string;
  image?: string | null;
  created_at?: string;
}

export type inCartProducts = {
  size: string;
  color: string;
  quantity: number;
};

export interface Product {
  id: number;
  title: string;
  description?: string;
  image?: string | null;
  price: string;
  size: string[];
  color: string[];
  rating: string;
  reviews: string[];
  gender?: string;
  variants: string[];
  keyFeatures: string[];
  created_at?: string;
  updated_at?: string;
  discount_type?: string;
  discount_value?: string;
  sale_to?: string;
  sale_from?: string;
  is_liked?: boolean;
  inCartProducts?: inCartProducts[];
}

export interface ProductsDataProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Product[];
  hasMore?: boolean;
}

export type User = {
  user: {
    id: number;
    email: string;
    name: string;
  };
};
