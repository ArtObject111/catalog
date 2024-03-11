import {applyMiddleware, combineReducers, compose, createStore} from "redux"
import { thunk }                                                from "redux-thunk";
import { reducer as formReducer }                               from 'redux-form';

import goodsReducer                                             from "./goods-reducer"

let reducers = combineReducers({
    goods: goodsReducer,
    form: formReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

// const store = createStore(reducers, applyMiddleware(thunkMiddleware))

window.store = store

export default store
