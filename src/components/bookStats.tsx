import { Book } from "@/types/book";
import { BookCover } from "./bookCover";

type BookStatProps = {
    book: Book;
    label?: string;
    extraInfo?: React.ReactNode;
};

const BookStatCard = ({ book, label, extraInfo }: BookStatProps) => {
    return (
        <div className={`flex sm:w-1/2 h-full gap-2 text-[12px]`}>
            <BookCover book={book} coverWidth={57.5} coverHeight={115} />
            <div>
                {label && <p className="font-bold">{label}</p>}
                <p>{book.edicao.nome_portugues}</p>
                {/* <p>{book.edicao.autor}</p> */}
                {extraInfo}
            </div>
        </div>
    );
};

export default BookStatCard;
