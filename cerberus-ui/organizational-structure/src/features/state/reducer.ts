import {LocationNode} from "./hierarchy-item.ts";
import {createSlice} from "@reduxjs/toolkit";
import {sliceBuilder} from "../../constants.ts";
const initialState: LocationNode[] = [];
export const locationHierarchySlice = createSlice({
  name: sliceBuilder('locationHierarchy'),
  initialState,
  reducers: {
    setLocationHierarchy: (_, action) => action.payload,
  },
});

export const {setLocationHierarchy} = locationHierarchySlice.actions;