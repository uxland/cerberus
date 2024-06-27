import {combineReducers, configureStore, Reducer} from "@reduxjs/toolkit";
import {routingSlice} from "../routing/routing-reducer.ts";

let reducers: Reducer = combineReducers({
    routes: routingSlice.reducer
});


export const store = configureStore({
    reducer: reducers,
})

export const injectReducer = (name: string, reducer: object) =>{
    reducers = combineReducers({...reducers, [name]: reducer});
    store.replaceReducer(reducers);
}
