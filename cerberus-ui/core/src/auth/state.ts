import {User} from "@cerberus/shared/src/domain/user.ts";
import {createSlice} from "@reduxjs/toolkit";
import {sliceBuilder} from "../constants/core-constants.ts";

const initialState: User = {
    authenticated: false,
}

export const userSlice = createSlice({
    name: sliceBuilder("user"),
    initialState: initialState,
    reducers:{
        setUser: (_, action) => action.payload,
        resetUser: () => initialState,
    }
});

export const {setUser, resetUser} = userSlice.actions;