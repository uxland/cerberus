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
    }
});



const contains = (items: LocationNode[], location: LocationNode): boolean => {
    const children = items || [];
    return children.some(child => child.id === location.id);
}

const updateChild = (parent: LocationNode, location: LocationNode): LocationNode => {
    const children = parent.children || [];
    return {
        ...parent,
        children: children.map(child => child.id === location.id ? {...child, ...location} : child)
    };
}

const appendChildToParent = (parent: LocationNode, location: LocationNode): LocationNode => {
    const children = parent.children || [];
    return {
        ...parent,
        children: [...children, location]
    };
}

const appendChild = (state: LocationNode[], location: LocationNode): LocationNode[] => {
    const addChild = (nodes: LocationNode[]): LocationNode[] => {
        return nodes.map(node => {
            if (node.id === location.parentId)
                return contains(node.children, location) ? updateChild(node, location) : appendChildToParent(node, location);
            return {...node, children: addChild(node.children || [])};
        });
    }

    if (!location.parentId) {
        return contains(state, location) ?
            state.map(node => node.id === location.id ? {...node, ...location} : node) : [...state, location];
    }

    return addChild(state);
};

export const {setLocationHierarchy, appendLocationItem} = locationHierarchySlice.actions;