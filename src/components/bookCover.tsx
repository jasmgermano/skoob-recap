import { Book } from "@/types/book";

export const BookCover = ({ book, coverHeight, coverWidth }: { book: Book, coverHeight?: number, coverWidth?: number }) => {
    const proxiedImage = `/api/image-proxy?url=${encodeURIComponent(book.edicao.capa_grande)}`;
    
    return (
        <img
                src={proxiedImage}
                alt={book.edicao.nome_portugues}
                width={coverWidth}
                height={coverHeight}
                className="custom-box-shadow h-full object-cover rounded-[6px]"
         />
    );
}