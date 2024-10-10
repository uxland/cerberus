import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {routingSlice} from "../routing/routing-reducer.ts";
import {userSlice} from "../auth/state.ts";


const reducers ={
    routes: routingSlice.reducer,
    user: userSlice.reducer,
}

export const store = configureStore({
    reducer: combineReducers(reducers),
})

export const injectReducer = (name: string, reducer: object) =>{
    reducers[name] = reducer;
    store.replaceReducer(combineReducers(reducers));
}
