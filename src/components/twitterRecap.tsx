import { Book } from "@/types/book";
import { BookCover } from "./bookCover";

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
        fontFamily: "Poppins, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {type === "general" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1.5rem",
              justifyContent: "center",
              alignItems: "start",
              width: "100%",
              maxWidth: "1100px",
            }}
          >
            {books.map((book) => (
              <div
                key={book.edicao.id}
                style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "2 / 3",
                    overflow: "hidden",
                    borderRadius: "6px",
                    boxShadow: "0 0 6px rgba(0,0,0,0.1)",
                    backgroundColor: "#f4f4f4",
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
                  }}
                >
                  {(() => {
                    const favoriteIcon = book.favorito == 1 ? "💜" : "";
                    if (!book.ranking) return `Sem nota ${favoriteIcon}`;
                    return `${book.ranking} ⭐ ${favoriteIcon}`;
                  })()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === "recap" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
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
        </div>
      )}
    </div>
  );
}
