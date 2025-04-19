import { Book } from "@/types/book";
import { BookItem } from "./bookItem";

type BookGridProps = {
  books: Book[];
  backgroundColor?: string;
  textColor?: string;
};

export function BookGrid({ books, backgroundColor, textColor }: BookGridProps) {
    const bookCount = books.length;
  
    const getBookWidth = () => {
      if (bookCount === 1) return 220;
      if (bookCount === 2) return 180;
      if (bookCount <= 4) return 160;
      if (bookCount > 10) return 140;
      return 170;
    };
  
    const bookWidth = getBookWidth();
  
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1.5rem",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {books.map((book) => (
          <BookItem
            key={book.edicao.id}
            book={book}
            backgroundColor={backgroundColor}
            textColor={textColor}
            width={bookWidth}
          />
        ))}
      </div>
    );
  }
  