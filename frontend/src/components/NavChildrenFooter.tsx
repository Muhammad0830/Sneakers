"use client";
import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useAuth } from "@/context/AuthContext";

const NavChildrenFooter = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <NavBar />
      <div className="pt-18 flex-1 overflow-hidden">{children}</div>
      <Footer />
    </div>
  );
};

export default NavChildrenFooter;
