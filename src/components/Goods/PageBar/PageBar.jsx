import React from "react";
import       "./page-bar.scss"

export const PageBar = React.memo(({
    currentPage,
    isLastPage,
    onFlipPage,
    isFetching
}) => {

    const flipNext = () => {
        onFlipPage(currentPage + 1)
    }

    const flipBack = () => {
        onFlipPage(currentPage - 1)
    }

    return (
        <div className={"page-number-bar"}>
            <button disabled={currentPage <= 1 || isFetching} onClick={flipBack}>{"<"}</button>
                {`   Стр. ${currentPage}  `}
            <button disabled={isLastPage || isFetching}
                    onClick={flipNext}>{">"}</button>
        </div>)
})
