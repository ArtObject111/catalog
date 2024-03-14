import React            from "react";
import { connect }      from "react-redux";

import                  "./goods.scss"
import { 
    clearFilter,
    findGoodsByFilterTC, 
    flipFilterTC,
    getBrandsTC, 
    getGoodsTC, 
    resetFormTC, 
    setCurrentPageTC }  from "../../redux/goods-reducer";
import { Product }      from "./Product/Product";
import { PageBar }      from "./PageBar/PageBar";
import { Preloader }    from "../../common/Preloader/Preloader";
import { FilterBar }    from "../FilterBar/FilterBar";

class Goods extends React.Component {

    componentDidMount() {
        const {getGoods, currentPage, pageSize, getBrands} = this.props
        getGoods(currentPage, pageSize)
        getBrands()
    }

    onFlipPage = (pageNumber) => {
        const {
            setCurrentPage,
            pageSize,
            isFiltered,
            flipFilter
        } = this.props

        isFiltered
        ? flipFilter (pageNumber, pageSize)
        : setCurrentPage(pageNumber, pageSize)
    }

    render () {

        const {
            goods,
            currentPage,
            isFetching,
            isLastPage,
            findGoods,
            resetForm,
            clearFilter,
            goodsBrands,
            isFiltered
        } = this.props
        
        return (
            <div className="app-wrapper">
                <FilterBar 
                    resetForm   = {resetForm}
                    findGoods   = {findGoods}
                    clearFilter = {clearFilter}
                    goodsBrands = {goodsBrands}
                    isFiltered  = {isFiltered}/>
                <div className="app-wrapper-content">
                    <PageBar
                        currentPage = {currentPage}
                        onFlipPage  = {this.onFlipPage}
                        isLastPage  = {isLastPage}
                        />
                    {isFetching ? <Preloader/> :
                    goods && goods.map((product) => <Product
                        key   = {product.id}
                        name  = {product.product}
                        brand = {product.brand}
                        id    = {product.id}
                        price = {product.price}
                    />)}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    goods:       state.goods.goodsData,
    pageSize:    state.goods.pageSize,
    currentPage: state.goods.currentPage,
    isFetching:  state.goods.isFetching,
    isLastPage:  state.goods.isLastPage,
    isFiltered:  state.goods.isFiltered,
    goodsBrands:  state.goods.goodsBrands
})

export default connect(mapStateToProps, {
    clearFilter:    clearFilter,
    setCurrentPage: setCurrentPageTC,
    getGoods:       getGoodsTC,
    findGoods:      findGoodsByFilterTC,
    resetForm:      resetFormTC,
    flipFilter:     flipFilterTC,
    getBrands:      getBrandsTC
})(Goods)
