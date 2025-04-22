import { Book } from "@/types/book";
import { BookItem } from "./bookItem";

type BookGridProps = {
  books: Book[];
  backgroundColor?: string;
  textColor?: string;
};

export function BookGrid({ books, backgroundColor, textColor }: BookGridProps) {
    const bookCount = books.length;
  
    const getBookWidth = (bookCount: number): number => {
      const containerWidth = 1100;
      const sidePadding = 24 * 2; 
      const gap = 24 * 2;    
      const maxColumns = Math.min(bookCount, 6);
      const availableWidth = containerWidth - sidePadding - gap * (maxColumns - 1);
      const bookWidth = Math.floor(availableWidth / maxColumns);

      if (bookWidth > 200) {
        return 200; 
      }
    
      return bookWidth;
    };
      
  
    const bookWidth = getBookWidth(bookCount);
  
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
  