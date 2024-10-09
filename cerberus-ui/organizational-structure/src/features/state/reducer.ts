import {LocationNode} from "./hierarchy-item.ts";
import {createSlice} from "@reduxjs/toolkit";
import {sliceBuilder} from "../../constants.ts";
const initialState: LocationNode[] = [];
export const locationHierarchySlice = createSlice({
  name: sliceBuilder('locationHierarchy'),
  initialState,
  reducers: {
    setLocationHierarchy: (_, action) => action.payload,
    appendLocationItem: (state, action) => appendChild(state, action.payload),
}});

const appendChild = (state: LocationNode[], location: LocationNode): LocationNode[] => {
  const addChild = (nodes: LocationNode[]): LocationNode[] => {
    return nodes.map(node => {
      if (node.id === location.parentId) {
        return {
          ...node,
          children: [...node.children, location]
        };
      }
      return {
        ...node,
        children: addChild(node.children)
      };
    });
  };

  if (!location.parentId) {
    return [...state, location];
  }

  return addChild(state);
};

export const {setLocationHierarchy, appendLocationItem} = locationHierarchySlice.actions;