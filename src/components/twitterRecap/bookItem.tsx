import { Book } from "@/types/book";
import { BookCover } from "../bookCover";

type BookItemProps = {
    book: Book;
    backgroundColor?: string;
    textColor?: string;
    width?: number;
  };
  
  export function BookItem({ book, backgroundColor, textColor, width = 140 }: BookItemProps) {
    const favoriteIcon = book.favorito === 1 ? "💜" : "";
    const label = !book.ranking ? `Sem nota ${favoriteIcon}` : `${book.ranking} ⭐${favoriteIcon}`;
  
    return (
      <div
        style={{
          width: `${width}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            aspectRatio: "2 / 3",
            overflow: "hidden",
            borderRadius: "6px",
            boxShadow: "0 0 6px rgba(0,0,0,0.1)",
            backgroundColor,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <BookCover book={book} />
        </div>
        <p
          style={{
            fontSize: "12px",
            marginTop: "0.5rem",
            textAlign: "center",
            padding: "4px 8px",
            borderRadius: "9999px",
            minWidth: "60px",
            color: textColor,
            fontWeight: 700,
          }}
        >
          {label}
        </p>
      </div>
    );
  }
  