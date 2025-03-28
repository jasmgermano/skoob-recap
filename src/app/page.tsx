'use client';

import { getUserBooks } from "@/services/skoob";
import { useState } from "react";
import BookStats from "@/components/bookStats";
import { Book } from "@/types/book";

type BookStats = {
  biggest: Book | null;
  smallest: Book | null;
  highestRating: Book | null;
  lowestRating: Book | null;
};

export default function Home() {  
  return (
    <div></div>
  );
}
