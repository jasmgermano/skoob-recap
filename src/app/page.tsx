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
const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [bookStats, setBookStats] = useState<BookStats>({
    biggest: null,
    smallest: null,
    highestRating: null,
    lowestRating: null,
  });

  const hasAnyBookStats = Object.values(bookStats).some(stat => stat !== null);

  const extractIdFromUrl = (url: string) => {
    const match = url.match(/\/usuario\/(\d+)(?:-[^\/]*)?$/);
    const id = match ? match[1] : null;
    return id;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const id = extractIdFromUrl(search);
    console.log(id);
    if (!id) return;

    try {
      const data = await getUserBooks(id);
      const readBooksInThisMonth = data.response.filter((book: { tipo: number, dt_leitura: string }) => {
        if (!book.dt_leitura) return false;

        const [day, month, year] = book.dt_leitura.split("/");
        const bookDate = new Date(`${year}-${month}-${day}`);

        return (
          book.tipo === 1 &&
          bookDate.getMonth() === new Date().getMonth() &&
          bookDate.getFullYear() === new Date().getFullYear()
        );
      });

      const biggestBook = readBooksInThisMonth.reduce((acc: Book | null, book: Book) => {
        if (!acc) return book;
        return book.edicao.paginas > acc.edicao.paginas ? book : acc;
      }, null);

      const smallestBook = readBooksInThisMonth.reduce((acc: Book | null, book: Book) => {
        if (!acc) return book;

        return book.edicao.paginas < acc.edicao.paginas ? book : acc;
      }, null);

      const highestRating = readBooksInThisMonth.reduce((acc: Book | null, book: Book) => {
        if (book.ranking === 0) return acc;

        if (!acc) return book;

        return book.ranking > acc.ranking ? book : acc;
      }, null);

      const lowestRating = readBooksInThisMonth.reduce((acc: Book | null, book: Book) => {
        if (book.ranking === 0) return acc;

        if (!acc) return book;

        return book.ranking < acc.ranking ? book : acc;
      }, null);

      setBookStats({
        biggest: biggestBook,
        smallest: smallestBook,
        highestRating,
        lowestRating,
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div></div>
  );
}
