import React       from "react"

import             "./product.scss"
import ProductIcon from "../../../assets/vector/bag.svg"

export const Product = React.memo(({
    name,
    brand,
    price,
    id
}) => {

    return (
        <div className="product">
            <div className="product__info">
                <img src={ProductIcon} alt="Product item" />
                <div className="product__header">
                    <label className="product__name">{name ? name : "Name doesn't exist"}</label>
                    <label className="product__brand">{brand ? brand : "Brand doesn't exist"}</label>
                    <label className="product__id">Артикул: {id && id}</label>
                </div>
            </div>
            <div className="product__price">
                {price ? price : "Price doesn't exist"} руб.
            </div>
        </div>
    )
})