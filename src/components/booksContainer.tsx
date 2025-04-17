import React, { forwardRef } from 'react';

type BooksContainerProps = React.PropsWithChildren<{
  showBookStats: boolean;
  backgroundColor?: string;
}>;

export const BooksContainer = forwardRef<HTMLDivElement, BooksContainerProps>(
  ({ children, backgroundColor }, ref) => {
    return (
      <div
        ref={ref}
        style={{ backgroundColor }}
        className={`bg-white max-w-4xl rounded-2xl flex flex-col gap-4 p-4 mt-5 sm:p-9`}
      >
        {children}
      </div>
    );
  }
);

BooksContainer.displayName = "BooksContainer";