import React from 'react'

export const BooksContainer = ({ children, showBookStats }: { children: React.ReactNode, showBookStats: boolean }) => {
    return (
        <div className={`transition-all duration-500 ease-in-out transform 
            ${showBookStats ? "opacity-100 scale-100" : "opacity-0 scale-95"} 
            ${!showBookStats ? "pointer-events-none h-0 overflow-hidden" : ""}
            bg-white w-full max-w-4xl rounded-2xl flex flex-col gap-4 p-4 mt-5 sm:p-6`}
            >
                {children}
            </div>
    )
}
