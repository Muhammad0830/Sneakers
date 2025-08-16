import { RowDataPacket } from "mysql2";

export interface Product extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  image: string | null;
  color: string;
  size: string;
  price: number;
  rating: number;
  reviews: string[];
  gender: string;
}

export interface Trending extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface Testimonial extends RowDataPacket {
  id: number;
  name: string;
  image: string;
  text: string;
  postedAt: string;
  likes: number;
}
