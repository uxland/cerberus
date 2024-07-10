import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {routingSlice} from "../routing/routing-reducer.ts";


const reducers ={
    routes: routingSlice.reducer,
}

export const store = configureStore({
    reducer: combineReducers(reducers),
})

export const injectReducer = (name: string, reducer: object) =>{
    reducers[name] = reducer;
    store.replaceReducer(combineReducers(reducers));
}
