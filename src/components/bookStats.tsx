import { Book } from "@/types/book";

type BookStatProps = {
    book: Book;
    label?: string;
    extraInfo?: React.ReactNode;
};

const BookStatCard = ({ book, label, extraInfo }: BookStatProps) => {
    return (
        <div className={`flex w-1/2 h-full gap-2 text-[12px]`}>
            <img
                src={book.edicao.capa_pequena}
                alt={book.edicao.nome_portugues}
                width={57.5}
                height={115}
            />
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
