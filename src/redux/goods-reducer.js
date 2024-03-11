import { stopSubmit } from "redux-form";
import { goodsAPI }   from "../api/api";

const SET_GOODS_IDS       = "SET-GOODS-IDS";
const SET_GOODS_DATA      = "SET-GOODS-DATA";
const SET_CURRENT_PAGE    = "SET-CURRENT-PAGE";
const TOGGLE_IS_FETCHING  = "TOGGLE-IS-FETCHING";
const TOGGLE_IS_LAST_PAGE = "TOGGLE-IS-LAST-PAGE";

const SET_FOUND_GOODS_IDS = "SET-FOUND-GOODS-IDS";

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
    filteredPagesCount: null
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
        default: {
            return state
        }
    }
}

// блок actionCreators
export const setGoodsIds      = (goodsIds) => ({ type: SET_GOODS_IDS, goodsIds })
export const setGoodsData     = (goodsData) => ({ type: SET_GOODS_DATA, goodsData })
export const setCurrentPage   = (currentPageNumber) => ({type: SET_CURRENT_PAGE, currentPageNumber})
export const toggleIsFetching = (isFetching) => ({type: TOGGLE_IS_FETCHING, isFetching})
export const toggleIsLastPage = (isLastPage) => ({type: TOGGLE_IS_LAST_PAGE, isLastPage})

export const setFoundGoodsIds = (foundGoodsIds) => ({ type: SET_GOODS_IDS, foundGoodsIds })

// блок thunkCreators
export const getGoodsTC = (currentPage, limit) => async (dispatch, getState) => {

    const pageSize = getState().goods.pageSize

  try { 
    dispatch(toggleIsFetching(true))
    const idsData = await goodsAPI.getIds(currentPage, limit) //вернёт idsData.length = limit + 1, т к запрашиваем на 1 товар больше, чем надо
    
    // если при запрашивании limit + 1 idsData.length < limit + 1, значит запрашиваемая страница последняя
    if (idsData.data.result.length < limit + 1) {
        dispatch(toggleIsLastPage(true))
    }
    else {
        idsData.data.result.splice(-1, 1)

        getState().goods.isLastPage &&
        dispatch(toggleIsLastPage(false))
    }

    console.log("idsData")
    console.log(idsData.data.result)

    //унификация дублирующихся id товаров
    let uniqIds = idsData.data.result.reduce((acc, id) => {

        if (!acc.some(el => el === id)) { 
            acc = [...acc, id]
        }

        return acc;

    }, []);

    console.log("uniqIds")
    console.log(uniqIds)

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

    console.log("paramsData")
    console.log(paramsData.data.result)

    //унификация дублирующихся товаров
    const uniqGoods = uniqObjectsArr(paramsData.data.result)

    console.log("uniqGoods")
    console.log(uniqGoods)

    dispatch(setGoodsData(uniqGoods))
}

export const findGoodsByFilterTC = (field) => async (dispatch, getState) => {
    try {
        const pageSize = getState().goods.pageSize
        const fields   = getState().form.filter
        const values   = Object.keys(getState().form.filter.values)
        const keys     = Object.keys(fields)
        const field    = keys[0]
        const value    = values[0]
        console.log(field)
        debugger
        console.log(fields)

        dispatch(toggleIsFetching(true))

        const response = await goodsAPI.findGoods(field, value)
        
        let ids = response.data.result
        dispatch(setFoundGoodsIds(ids))

        if (ids.length > pageSize) {
            const pagesCount = Math.ceil(ids / pageSize)
            ids = ids.slice(0, pageSize)
        }

        await dispatch(getGoodsDataTC(ids))
        dispatch(toggleIsFetching(false))
    }
    catch (error) {
        dispatch(stopSubmit("filter")) ///AC, который заготовили разработчики redux-form
                                             //стоит распарсить строку ошибки
        console.log("Ошибка:")
        console.error(error)
        dispatch(findGoodsByFilterTC())
    }
}

export default goodsReducer