import React          from "react";
import { connect }    from "react-redux";

import { getGoodsTC, setCurrentPageThunkCreator } from "../../redux/goods-reducer";
import { Product }    from "./Product/Product";
import { PageBar }    from "./PageBar/PageBar";
import { Preloader }  from "../../common/Preloader/Preloader";

class Goods extends React.Component {

    componentDidMount() {
        const {getGoods, currentPage, pageSize} = this.props
        getGoods(currentPage, pageSize)
    }

    onFlipPage = (pageNumber) => {
        const {
            setCurrentPage,
            pageSize
        } = this.props

        setCurrentPage(pageNumber, pageSize)
    }

    render () {

        const {
            goods,
            currentPage,
            isFetching,
            isLastPage
        } = this.props

        if (isFetching) {
            return <Preloader/>
        }

        return (
            <div>
                <PageBar
                    currentPage ={currentPage}
                    onFlipPage  ={this.onFlipPage}
                    isLastPage  ={isLastPage}
                    />
               {goods && goods.map((product) => <Product
                    key   = {product.id}
                    name  = {product.product}
                    brand = {product.brand}
                    price = {product.price}
                />)}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    goods:       state.goods.goodsData,
    pageSize:    state.goods.pageSize,
    currentPage: state.goods.currentPage,
    isFetching:  state.goods.isFetching,
    isLastPage:  state.goods.isLastPage
})

export default connect(mapStateToProps, {
    setCurrentPage: setCurrentPageThunkCreator,
    getGoods: getGoodsTC
})(Goods)
