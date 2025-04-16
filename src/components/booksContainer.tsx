import React, { forwardRef } from 'react';

type BooksContainerProps = React.PropsWithChildren<{
  showBookStats: boolean;
}>;

export const BooksContainer = forwardRef<HTMLDivElement, BooksContainerProps>(
  ({ children }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white max-w-4xl rounded-2xl flex flex-col gap-4 p-4 mt-5 sm:p-9`}
      >
        {children}
      </div>
    );
  }
);

BooksContainer.displayName = "BooksContainer";