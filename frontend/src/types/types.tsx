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
  created_at?: string;
  updated_at?: string;
}
