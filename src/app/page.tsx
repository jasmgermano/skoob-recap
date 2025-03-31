'use client';

import { getUserBooks } from "@/services/skoob";
import { useEffect, useState } from "react";
import BookStats from "@/components/bookStats";
import { Book } from "@/types/book";
import { validateSearch } from "@/validations/validators";

type BookStats = {
  biggest: Book | null;
  smallest: Book | null;
  highestRating: Book | null;
  lowestRating: Book | null;
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [bookStats, setBookStats] = useState<BookStats>({
    biggest: null,
    smallest: null,
    highestRating: null,
    lowestRating: null,
  });
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const hasAnyBookStats = Object.values(bookStats).some(stat => stat !== null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(false);
    setErrorMessage("");

    const { id, validationMessage } = validateSearch(search);
    if (validationMessage) {
      setError(true);
      setErrorMessage(validationMessage);
      return;
    }

    if (bookStats) {
      setBookStats({
        biggest: null,
        smallest: null,
        highestRating: null,
        lowestRating: null,
      });
    }

    if (!id) return;

    setLoading(true);
    try {
      const data = await getUserBooks(id);
      if (!data.response) {
        setError(true);
        setErrorMessage("Erro ao buscar livros do usuário");
        return;
      }

      if (data.response.length === 0) {
        setError(true);
        setErrorMessage("Nenhum livro encontrado");
        return;
      }

      const readBooksInThisMonth = data.response.filter((book: { tipo: number, dt_leitura: string }) => {
        if (!book.dt_leitura) return false;

        const [day, month, year] = book.dt_leitura.split("/");
        const bookDate = new Date(Date.UTC(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        ));        
        
        return (
          book.tipo === 1 &&
          bookDate.getUTCMonth() === new Date().getUTCMonth() &&
          bookDate.getUTCFullYear() === new Date().getUTCFullYear()
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
      setError(true);
      setErrorMessage(error instanceof Error ? error.message : "Erro ao buscar livros do usuário");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const monthName = new Date().toLocaleString("pt-br", { month: "long" });
    setMonth(monthName);
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 3000);
    }
  }, [error]);

  return (
    <div className="flex items-stretch justify-center min-h-screen py-2 font-[family-name:var(--font-poppins)] sm:p-10 px-4">
      <div className="w-full max-w-6xl min-h-[300px] bg-white rounded-4xl flex justify-center items-center flex-col gap-3 p-4 sm:p-5 py-14 sm:bg-[#EEE2EE] md:shadow-md md:rounded-2xl md:p-10">
        <div className="flex flex-col items-center gap-3 w-full bg-[#EEE2EE] rounded-4xl p-4 sm:bg-none">
          <span className="text-small">⋆ BeMine Presents ⋆</span>
          <h1 className="text-2xl">lidos no mês de</h1>
          <h2 className="text-4xl font-medium -mt-5 mb-5">{month}</h2>
          <form onSubmit={handleSubmit} className="flex items-center w-full max-w-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 sm:gap-0 sm:bg-white rounded-full">
              <div className="flex items-center justify-center w-full bg-white rounded-full">
                <div className="h-7 w-10 bg-[#DCC2DC] rounded-full flex items-center justify-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="#000" d="M10.232 10.231a5 5 0 0 1 6.89-.172l.181.172l2.828 2.829a5 5 0 0 1-6.89 7.243l-.18-.172l-2.122-2.122a1 1 0 0 1 1.32-1.497l.094.083l2.122 2.122a3 3 0 0 0 4.377-4.1l-.135-.143l-2.828-2.828a3 3 0 0 0-4.243 0a1 1 0 0 1-1.414-1.415M3.868 3.867a5 5 0 0 1 6.89-.172l.181.172L13.06 5.99a1 1 0 0 1-1.32 1.497l-.094-.083l-2.121-2.121A3 3 0 0 0 5.147 9.38l.135.144l2.829 2.829a3 3 0 0 0 4.242 0a1 1 0 1 1 1.415 1.414a5 5 0 0 1-6.89.172l-.182-.172l-2.828-2.829a5 5 0 0 1 0-7.07Z" /></g></svg>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white rounded-full h-7 w-full p-2 text-xs sm:text-sm appearance-none border-none focus:outline-none"
                />
              </div>
              <button type="submit" className="h-7 w-full sm:w-14 bg-[#DCC2DC] rounded-full flex items-center justify-center cursor-pointer">
                {loading ? (
                  <output className="flex items-center justify-center w-full h-full">
                    <svg aria-hidden="true" className="inline w-3 h-3 text-[#b37ab3] animate-spin fill-[#EEE2EE]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </output>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" /></svg>
                )}
              </button>
            </div>
          </form>
          <span className="text-xs text-red-500">{error && errorMessage}</span>
        </div>
  
        {hasAnyBookStats && (
          <div className="bg-white w-full max-w-4xl rounded-2xl flex flex-col gap-4 p-4 mt-5 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4">
              {bookStats.biggest && (
                <BookStats
                  book={bookStats.biggest}
                  label="Maior livro"
                  extraInfo={<p>páginas: {bookStats.biggest.edicao.paginas}</p>}
                />
              )}
              {bookStats.smallest && (
                <BookStats
                  book={bookStats.smallest}
                  label="Menor livro"
                  extraInfo={<p>páginas: {bookStats.smallest.edicao.paginas}</p>}
                />
              )}
            </div>
  
            <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4">
              {bookStats.highestRating && (
                <BookStats
                  book={bookStats.highestRating}
                  label="Melhor nota"
                  extraInfo={
                    <div className="flex items-center gap-1">
                      <p>nota: {bookStats.highestRating.ranking}</p>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="#ffd007" d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z"/></svg>
                    </div>
                  }
                />
              )}
              {bookStats.lowestRating && (
                <BookStats
                  book={bookStats.lowestRating}
                  label="Pior nota"
                  extraInfo={
                    <div className="flex items-center gap-1">
                      <p>nota: {bookStats.lowestRating.ranking}</p>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="#ffd007" d="..." /></svg>
                    </div>
                  }
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );  
}
