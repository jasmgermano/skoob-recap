import { Book } from "@/types/book";

export const BookCover = ({ book, coverHeight, coverWidth }: { book: Book, coverHeight?: number, coverWidth?: number }) => {
    return (
        <img
                src={book.edicao.capa_grande}
                alt={book.edicao.nome_portugues}
                width={coverWidth}
                height={coverHeight}
                className="custom-box-shadow h-full object-cover"
         />
    );
}