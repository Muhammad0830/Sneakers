"use client";
import { notFound, useParams } from "next/navigation";
import React from "react";

const ProductIdClient = () => {
  const params = useParams();
  const id = params?.id;

  console.log("id", id);

  if (id) return notFound();

  return <div>page</div>;
};

export default ProductIdClient;
