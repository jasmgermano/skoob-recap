import { Book } from "@/types/book";
import { BookItem } from "./bookItem";

type BookGridProps = {
  books: Book[];
  backgroundColor?: string;
  textColor?: string;
};

export function BookGrid({ books, backgroundColor, textColor }: BookGridProps) {
  const centerBooks = books.length <= 2;

  if (centerBooks) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1.5rem",
          width: "100%",
        }}
      >
        {books.map((book) => (
          <BookItem
            key={book.edicao.id}
            book={book}
            backgroundColor={backgroundColor}
            textColor={textColor}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "1.5rem",
        justifyContent: "center",
        alignItems: "start",
        maxWidth: "1100px",
        width: "100%",
        margin: "0 auto",
      }}
    >
      {books.map((book) => (
        <BookItem
          key={book.edicao.id}
          book={book}
          backgroundColor={backgroundColor}
          textColor={textColor}
        />
      ))}
    </div>
  );
}
