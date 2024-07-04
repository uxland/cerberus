import {sliceBuilder} from "../constants/core-constants.ts";
import {createSlice} from "@reduxjs/toolkit";

const initialState =[];
export const routingSlice = createSlice({
  name: sliceBuilder('routing'),
  initialState,
  reducers: {
    addRoute: (state, action) => [...state, action.payload]
  },
});
export const {addRoute} = routingSlice.actions;