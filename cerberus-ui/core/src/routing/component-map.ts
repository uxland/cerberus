import {ComponentType} from "react";

const componentMap: { [key: string]: ComponentType<any> } = {};

export const registerRouteComponent = <T>(name: string, component: ComponentType<T>) => {
  componentMap[name] = component;
};
export const unregisterRouteComponent = (name: string) => delete componentMap[name];
export const getRouteComponent = (name: string) => componentMap[name];