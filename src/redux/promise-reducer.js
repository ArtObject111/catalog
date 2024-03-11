import { goodsAPI } from "../api/api";

const SET_GOODS_IDS      = "SET-GOODS-IDS";
const SET_GOODS_PARAMS   = "SET-GOODS-PARAMS";
const SET_CURRENT_PAGE   = "SET-CURRENT-PAGE";
const TOGGLE_IS_FETCHING = "TOGGLE-IS-FETCHING";
const TOGGLE_IS_LAST_PAGE = "TOGGLE-IS-LAST-PAGE";

let initialState = {
    goodsIds:    null,
    goodsData:   null,
    isFetching:  true,
    isLastPage:  false,
    pageSize:    50,
    currentPage: 160,
    //         {
    //             "brand": "Jacob & Co",
    //             "id": "18e4e3bd-5e60-4348-8c92-4f61c676be1f",
    //             "price": 52400.0,
    //             "product": "\u0417\u043e\u043b\u043e\u0442\u043e\u0435 \u043a\u043e\u043b\u044c\u0446\u043e \u0441 \u0431\u0440\u0438\u043b\u043b\u0438\u0430\u043d\u0442\u043e\u043c"
    //         },
    //         {
    //             "brand": null,
    //             "id": "711837ec-57f6-4145-b17f-c74c2896bafe",
    //             "price": 4500.0,
    //             "product": "\u0417\u043e\u043b\u043e\u0442\u043e\u0435 \u043a\u043e\u043b\u044c\u0446\u043e \u0441 \u0431\u0440\u0438\u043b\u043b\u0438\u0430\u043d\u0442\u0430\u043c\u0438"
    //         },
    //         {
    //             "brand": null,
    //             "id": "6c972a4a-5b91-4a98-9780-3a19a7f41560",
    //             "price": 55000.0,
    //             "product": "\u0417\u043e\u043b\u043e\u0442\u043e\u0439 \u0431\u0440\u0430\u0441\u043b\u0435\u0442 \u0441 \u0431\u0440\u0438\u043b\u043b\u0438\u0430\u043d\u0442\u0430\u043c\u0438 \u0438 \u0430\u043c\u0435\u0442\u0438\u0441\u0442\u0430\u043c\u0438"
    //         }
}

const goodsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_GOODS_IDS:
            debugger
            return {
                ...state,
                goodsIds: action.goodsIds
            }
        case SET_GOODS_PARAMS:

            // let uniqGoods = action.goodsParams.reduce((acc, obj) => {

            //   if (!acc.some(o => o.id === obj.id)) { 
            //       acc = [...acc, obj]
            //   }  
            //   return acc;
            // }, []);
            
            return {
                ...state,
                goodsData: action.goodsParams
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
            debugger
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
export const setGoodsParams   = (goodsParams) => ({ type: SET_GOODS_PARAMS, goodsParams })
export const setCurrentPage   = (currentPageNumber) => ({type: SET_CURRENT_PAGE, currentPageNumber})
export const toggleIsFetching = (isFetching) => ({type: TOGGLE_IS_FETCHING, isFetching})
export const toggleIsLastPage = (isLastPage) => ({type: TOGGLE_IS_LAST_PAGE, isLastPage})

// блок thunkCreators
export const getGoodsTC = (currentPage, limit) => async (dispatch, getState) => {

    const pageSize = getState().goods.pageSize

  try { 
    dispatch(toggleIsFetching(true))
    const idsData = await goodsAPI.getIds(currentPage, limit) //вернёт idsData.length = limit + 1, т к запрашиваем на 1 товар больше, чем надо
    
    // если при запрашивании limit + 1 idsData.length < limit + 1, значит запрашиваемая страница последняя
    if (idsData.data.result.length < limit + 1) {
        debugger
        // console.log("Последняя страница")
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
        else {
            console.log(id)
        }
        return acc;
    }, []);

    console.log("uniqIds")
    console.log(uniqIds)

    if (uniqIds.length < pageSize) {
        debugger
        const diffFromPageSize = pageSize - uniqIds.length
        dispatch(getGoodsTC(currentPage, pageSize + diffFromPageSize))
    }

    await dispatch(setGoodsIds(uniqIds))
    const paramsData = await goodsAPI.getParams(uniqIds)

    console.log("paramsData")
    console.log(paramsData.data.result)

    //унификация дублирующихся товаров
    let uniqGoods = paramsData.data.result.reduce((acc, obj) => {
        if (!acc.some(o => o.id === obj.id)) { 
            acc = [...acc, obj]
        }
        else {
            console.log(obj.id)
        }
        return acc;
    }, []);

    console.log("uniqGoods")
    console.log(uniqGoods)

    dispatch(setGoodsParams(uniqGoods))
    dispatch(toggleIsFetching(false))
  }
  catch (error) {
    console.log("Ошибка:")
    console.error(error.message)
    dispatch(getGoodsTC(currentPage, limit))
  }
}

export const setCurrentPageThunkCreator = (pageNumber, pageSize) => async (dispatch) => {
    dispatch(getGoodsTC(pageNumber, pageSize))
    dispatch(setCurrentPage(pageNumber))
}

export default goodsReducer