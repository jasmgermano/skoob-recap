import { Book } from "@/types/book";
import { BookCover } from "../bookCover";
import RecapContainer from "./recapContainer";
import { BookGrid } from "./bookGrid";

type TwitterRecapProps = {
  books: Book[];
  stats: {
    biggest: Book | null;
    smallest: Book | null;
    highestRating: Book | null;
    lowestRating: Book | null;
  };
  type: "recap" | "general";
  backgroundColor?: string;
  textColor?: string;
};

export function TwitterRecap({ books, stats, type, backgroundColor, textColor }: TwitterRecapProps) {

  function renderStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    let stars = "⭐".repeat(fullStars);
    if (hasHalf) stars += "½";

    return stars;
  }


  return (
    <div
      style={{
        width: "1200px",
        height: "675px",
        padding: "3rem",
        backgroundColor: backgroundColor,
        color: textColor,
        fontFamily: "var(--font-poppins)",
        boxSizing: "border-box",
      }}
    >
      {type === "general" && (
        <RecapContainer>
          <BookGrid books={books} backgroundColor={backgroundColor} textColor={textColor} />
        </RecapContainer>
      )}

      {type === "recap" && (
        <RecapContainer>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "3rem 4rem",
            }}
          >
            {[
              { book: stats.biggest, label: "Maior livro", value: `${stats.biggest?.edicao.paginas} páginas` },
              { book: stats.smallest, label: "Menor livro", value: `${stats.smallest?.edicao.paginas} páginas` },
              { book: stats.highestRating, label: "Melhor nota", value: stats.highestRating ? renderStars(Math.round(stats.highestRating.ranking * 2) / 2) : "" },
              { book: stats.lowestRating, label: "Pior nota", value: stats.lowestRating ? renderStars(Math.round(stats.lowestRating.ranking * 2) / 2) : "" },

            ]
              .filter(({ book }) => book)
              .map(({ book, label, value }, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "140px",
                      height: "210px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                      flexShrink: 0,
                    }}
                  >
                    <BookCover book={book as Book} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "18px", marginBottom: "0.25rem" }}>
                      {label}
                    </div>
                    <div style={{ fontWeight: 500 }}>{(book as Book).edicao.nome_portugues}</div>
                    <div style={{ fontSize: "15px", marginTop: "0.25rem" }}>{value}</div>
                  </div>
                </div>
              ))}
          </div>
        </RecapContainer>
      )}
    </div>
  );
}
