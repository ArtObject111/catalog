import { reset, stopSubmit } from "redux-form";
import { goodsAPI }          from "../api/api";

const SET_GOODS_IDS       = "SET-GOODS-IDS";
const SET_GOODS_DATA      = "SET-GOODS-DATA";
const SET_CURRENT_PAGE    = "SET-CURRENT-PAGE";
const TOGGLE_IS_FETCHING  = "TOGGLE-IS-FETCHING";
const TOGGLE_IS_LAST_PAGE = "TOGGLE-IS-LAST-PAGE";
const TOGGLE_IS_FILTERED  = "TOGGLE-IS-LAST-FILTERED";
const SET_FOUND_GOODS_IDS = "SET-FOUND-GOODS-IDS";
const SET_GOODS_BRANDS    = "SET-GOODS-BRANDS";

const uniqObjectsArr = (array) => {
    return array.reduce((acc, obj) => {
        if (!acc.some(o => o.id === obj.id)) { 
            acc = [...acc, obj]
        }
        return acc;
    }, []);
}

let initialState = {
    goodsIds:    null,
    goodsData:   null,
    isFetching:  true,
    isLastPage:  false,
    pageSize:    50,
    currentPage: 1,

    foundIds:           null,
    filteredPagesCount: null,
    isFiltered:         false,
    filteredByField:    null,
    filteredByValue:    null,
    goodsBrands:        null
}

const goodsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_GOODS_IDS:
            return {
                ...state,
                goodsIds: action.goodsIds
            }
        case SET_FOUND_GOODS_IDS:
            return {
                ...state,
                foundGoodsIds: action.foundGoodsIds,
                filteredPagesCount: action.filteredPagesCount
            }
        case SET_GOODS_DATA:
            return {
                ...state,
                goodsData: action.goodsData
            }
        case TOGGLE_IS_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching
            }
        case SET_CURRENT_PAGE:
            return {
                ...state,
                currentPage: action.currentPageNumber
            }
        case TOGGLE_IS_LAST_PAGE:
            return {
                ...state,
                isLastPage: action.isLastPage
            }
        case TOGGLE_IS_FILTERED:

            return {
                ...state,
                isFiltered: action.isFiltered,
                filteredByField: action.filteredByField,
                filteredByValue: action.filteredByValue
            }
        case SET_GOODS_BRANDS:
            return {
                ...state,
                goodsBrands: action.goodsBrands
            }
        default: {
            return state
        }
    }
}

// блок actionCreators
export const setGoodsIds      = (goodsIds) => ({ type: SET_GOODS_IDS, goodsIds })
export const setGoodsBrands   = (goodsBrands) => ({ type: SET_GOODS_BRANDS, goodsBrands })
export const setGoodsData     = (goodsData) => ({ type: SET_GOODS_DATA, goodsData })
export const setCurrentPage   = (currentPageNumber) => ({type: SET_CURRENT_PAGE, currentPageNumber})
export const toggleIsFetching = (isFetching) => ({type: TOGGLE_IS_FETCHING, isFetching})
export const toggleIsLastPage = (isLastPage) => ({type: TOGGLE_IS_LAST_PAGE, isLastPage})
export const toggleIsFiltered = (isFiltered, filteredByField, filteredByValue) => ({type: TOGGLE_IS_FILTERED, isFiltered, filteredByField, filteredByValue})

export const setFoundGoodsIds = (foundGoodsIds) => ({ type: SET_GOODS_IDS, foundGoodsIds })

// блок thunkCreators
export const getGoodsTC = (currentPage, limit) => async (dispatch, getState) => {

    const pageSize = getState().goods.pageSize

  try { 
    dispatch(toggleIsFetching(true))

    //вернёт idsData.length = limit + 1, т к запрашиваем на 1 товар больше, чем надо
    const idsData = await goodsAPI.getIds(currentPage, limit)
    
    // если при запрашивании limit + 1 idsData.length < limit + 1, значит запрашиваемая страница последняя
    if (idsData.data.result.length < limit + 1) {
        dispatch(toggleIsLastPage(true))
    }
    else {
        idsData.data.result.splice(-1, 1)

        getState().goods.isLastPage &&
        dispatch(toggleIsLastPage(false))
    }

    //унификация дублирующихся id товаров
    let uniqIds = idsData.data.result.reduce((acc, id) => {

        if (!acc.some(el => el === id)) { 
            acc = [...acc, id]
        }
        return acc;

    }, []);

    if (uniqIds.length < pageSize && idsData.data.result.length === pageSize) {
        const diffFromPageSize = pageSize - uniqIds.length
        dispatch(getGoodsTC(currentPage, pageSize + diffFromPageSize))
    }

    dispatch(setGoodsIds(uniqIds))
    await dispatch(getGoodsDataTC(uniqIds))
    dispatch(toggleIsFetching(false))
  }
  catch (error) {
    console.log("Ошибка:")
    console.error(error.message)
    dispatch(getGoodsTC(currentPage, limit))
  }
}

export const setCurrentPageTC = (pageNumber, pageSize) => async (dispatch) => {
    dispatch(getGoodsTC(pageNumber, pageSize))
    dispatch(setCurrentPage(pageNumber))
}

export const getGoodsDataTC = (ids) => async (dispatch) => {
    const paramsData = await goodsAPI.getParams(ids)

    //унификация дублирующихся товаров
    const uniqGoods = uniqObjectsArr(paramsData.data.result)

    dispatch(setGoodsData(uniqGoods))
}

export const findGoodsByFilterTC = (field) => async (dispatch, getState) => {
    try {
        const pageSize = getState().goods.pageSize

        let values  = getState().form.filter.values
        let field   = Object.keys(values)[0]
        let value   = values[field]

        if (field === "price") {
            value = Number(value)
        }
        
        dispatch(toggleIsFetching(true))

        const response = await goodsAPI.findGoods(field, value)
        
        let ids = response.data.result
        
        dispatch(setFoundGoodsIds(ids))

        if (ids.length > pageSize) {
            ids = ids.slice(0, pageSize)
            dispatch(toggleIsLastPage(false))
        } else {
            dispatch(toggleIsLastPage(true))
        }

        await dispatch(getGoodsDataTC(ids))
        dispatch(setCurrentPage(1))
        dispatch(toggleIsFiltered(true, field, value))
        dispatch(toggleIsFetching(false))
    }
    
    catch (error) {
        dispatch(stopSubmit("filter")) ///AC, который заготовили разработчики redux-form
        console.log("Ошибка:")
        console.error(error)
        dispatch(findGoodsByFilterTC(field))
    }
}

export const resetFormTC = () => (dispatch) => {
    dispatch(reset("filter"))
}

export const clearFilter = () => async(dispatch, getState) => {

    const pageSize    = getState().goods.pageSize
    const currentPage = 1
    
    dispatch(toggleIsFetching(true))
    await dispatch(getGoodsTC(currentPage, pageSize))
    dispatch(toggleIsFiltered(false, null, null))
    await dispatch(reset("filter"))
    dispatch(setCurrentPage(1))
    dispatch(toggleIsFetching(false))
}

export const getBrandsTC = () => async(dispatch) => {

    try{
        let data = await goodsAPI.getBrands()
        
        let brands = data.data.result.reduce((acc, brand) => {
           
            if ((brand !== null) && (!acc.some(el => el === brand))) { 
                acc = [...acc, brand]
            }
            return acc;

        }, [])
        
        dispatch(setGoodsBrands(brands))
        }
    catch (error) {
        console.log("Ошибка")
        console.error(error)
        dispatch(getBrandsTC())
    }
}   

export const flipFilterTC = (currentPage, pageSize) => async(dispatch, getState) => {

    const field = getState().goods.filteredByField
    const value = getState().goods.filteredByValue

    try {
        dispatch(toggleIsFetching(true))
    
        const response = await goodsAPI.findGoods(field, value)
        
        let ids = response.data.result
        dispatch(setFoundGoodsIds(ids))
    
        if (ids.length > pageSize*currentPage) {
            dispatch(toggleIsLastPage(false))
        } else {
            dispatch(toggleIsLastPage(true))
        }
        
        ids = ids.slice((currentPage-1)*pageSize, pageSize*currentPage)
        
        await dispatch(getGoodsDataTC(ids))
        dispatch(setCurrentPage(currentPage))
        dispatch(toggleIsFetching(false))
    }
   catch (error) {
        console.log("Ошибка:")
        console.error(error)
        dispatch(flipFilterTC(currentPage, pageSize))
   }
}

export default goodsReducer