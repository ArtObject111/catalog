import React from "react";
import       "./page-bar.scss"

export const PageBar = ({
    currentPage,
    isLastPage,
    onFlipPage
}) => {

    const flipNext = () => {
        onFlipPage(currentPage + 1)
    }

    const flipBack = () => {
        onFlipPage(currentPage - 1)
    }

    return (
        <div className={"page-number-bar"}>
            <button disabled={currentPage <= 1} onClick={flipBack}>{"<"}</button>
                {`   Стр. ${currentPage}  `}
            <button disabled={isLastPage}
                    onClick={flipNext}>{">"}</button>
        </div>)
}
