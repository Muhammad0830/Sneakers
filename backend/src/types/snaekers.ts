import { RowDataPacket } from "mysql2";

export interface Product extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface Trending extends RowDataPacket{
  id: number;
  title: string;
  description: string;
  image: string;
}
