'use client';

import { getUserBooks } from "@/services/skoob";
import { useEffect, useState } from "react";
import BookStats from "@/components/bookStats";
import { Book } from "@/types/book";
import { validateSearch } from "@/validations/validators";
import { BooksContainer } from "@/components/booksContainer";
import { BookCover } from "@/components/bookCover";

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
  const [showBookStats, setShowBookStats] = useState(false);
  const [inputPosition, setInputPosition] = useState<"center" | "top">("center");
  const [type, setType] = useState<"recap" | "general" | "">("recap");
  const [readBooksInThisMonth, setReadBooksInThisMonth] = useState<Book[]>([]);

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

        const rawDate = book.dt_leitura.trim();
        const [datePart] = rawDate.split(" ");
        const [year, month, day] = datePart.split("-");

        if (!day || !month || !year) {
          console.warn("Data inválida encontrada:", book.dt_leitura);
          return false;
        }

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

      setReadBooksInThisMonth(readBooksInThisMonth);
      console.log("Livros lidos no mês atual:", readBooksInThisMonth);
      if (readBooksInThisMonth.length === 0) {
        setError(true);
        setErrorMessage("Nenhum livro lido neste mês");
        return;
      }

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
    if (error || search === "") {
      setInputPosition("top");
      setTimeout(() => {
        setShowBookStats(false);
      }, 300);
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
        setBookStats({
          biggest: null,
          smallest: null,
          highestRating: null,
          lowestRating: null,
        });
      }, 3000);
    }
  }, [error, search]);

  useEffect(() => {
    if (hasAnyBookStats) {
      setInputPosition("center");
      setShowBookStats(true);
    }
  }, [bookStats]);

  return (
    <div className="flex items-stretch justify-center min-h-screen py-2 font-[family-name:var(--font-poppins)] sm:p-10 px-4">
      <div className="w-full max-w-6xl min-h-[300px] bg-white rounded-4xl flex justify-center items-center flex-col gap-3 p-4 sm:p-5 py-14 sm:bg-primary md:shadow-md md:rounded-2xl md:p-10">
        <div className="flex flex-col items-center gap-3 w-full bg-primary rounded-4xl p-4 sm:bg-none transition-all duration-500 ease-in-out"
          style={{ marginTop: inputPosition === 'top' ? '2rem' : '6rem' }}
        >
          <span className="text-small">⋆ BeMine Presents ⋆</span>
          <h1 className="text-2xl">lidos no mês de</h1>
          <h2 className="text-4xl text-center font-medium -mt-5 mb-5 flex items-center gap-1"><span className="text-xl">‧₊˚🖇️✩</span>{month}</h2>
          <form onSubmit={handleSubmit} className="flex items-center w-full max-w-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 sm:gap-0 sm:bg-white rounded-full">
              <div className="flex items-center justify-center w-full bg-white rounded-full">
                <div className="h-7 w-10 bg-secondary rounded-full flex items-center justify-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="#000" d="M10.232 10.231a5 5 0 0 1 6.89-.172l.181.172l2.828 2.829a5 5 0 0 1-6.89 7.243l-.18-.172l-2.122-2.122a1 1 0 0 1 1.32-1.497l.094.083l2.122 2.122a3 3 0 0 0 4.377-4.1l-.135-.143l-2.828-2.828a3 3 0 0 0-4.243 0a1 1 0 0 1-1.414-1.415M3.868 3.867a5 5 0 0 1 6.89-.172l.181.172L13.06 5.99a1 1 0 0 1-1.32 1.497l-.094-.083l-2.121-2.121A3 3 0 0 0 5.147 9.38l.135.144l2.829 2.829a3 3 0 0 0 4.242 0a1 1 0 1 1 1.415 1.414a5 5 0 0 1-6.89.172l-.182-.172l-2.828-2.829a5 5 0 0 1 0-7.07Z" /></g></svg>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white rounded-full h-7 w-full p-2 text-xs sm:text-sm appearance-none border-none focus:outline-none"
                />
              </div>
              <button type="submit" className="h-7 w-full sm:w-14 bg-secondary rounded-full flex items-center justify-center cursor-pointer">
                {loading ? (
                  <svg aria-hidden="true" className="inline w-3 h-3 text-[#b37ab3] animate-spin fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" /></svg>
                )}
              </button>
            </div>
          </form>
          <span
            className={`text-xs text-red-500 transition-opacity duration-500 min-h-[1rem] ${error ? "opacity-100" : "opacity-0"
              }`}
          >
            {errorMessage}
          </span>
        </div>
        {hasAnyBookStats && (
          <>
            <div>
              <button
                onClick={() => {
                  setType("recap");
                }}
                className={`cursor-pointer text-sm p-1 w-20 rounded-full text-black  ${type !== "recap" ? "bg-[#D9D9D9]" : "bg-secondary"}
                  }`}
              >
                Recap
              </button>
              <button
                onClick={() => {
                  setType("general");
                }}
                className={`cursor-pointer text-sm ml-2 p-1 w-20 rounded-full text-black ${type !== "general" ? "bg-[#D9D9D9]" : "bg-secondary"}
                  }`}
              >
                Geral
              </button>
            </div>
            {type === "recap" && (
              <BooksContainer showBookStats={showBookStats}>
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
                        <p>nota: {bookStats.highestRating.ranking} ⭐</p>
                      }
                    />
                  )}
                  {bookStats.lowestRating && (
                    <BookStats
                      book={bookStats.lowestRating}
                      label="Pior nota"
                      extraInfo={
                        <p>nota: {bookStats.lowestRating.ranking} ⭐</p>
                      }
                    />
                  )}
                </div>
              </BooksContainer>
            )}
            {type === "general" && (
              <BooksContainer showBookStats={showBookStats}>
                <div className="w-full flex flex-wrap justify-center items-stretch gap-3">
                  {readBooksInThisMonth.map((book) => (
                    <div key={book.edicao.id} className="">
                      <div className="h-40">
                        <BookCover book={book} />
                      </div>
                      <div className={`bg-[#F5F5F5] rounded-full mb-1 mt-2 ${book.ranking ? "w-10" : "w-16"}`}>
                        <p className="text-[10px] text-center p-1">{book.ranking ? `${book.ranking} ⭐` : "Sem nota"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </BooksContainer>
            )}
          </>
        )}
      </div>
    </div>
  );
}
