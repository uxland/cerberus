import {constantBuilder} from "../utils";

export const coreModuleName = 'cerberus-core';
const coreConstantsBuilder = (suffix: string, sperator?: string) =>
    constantBuilder(coreModuleName, suffix, sperator);

export const sliceBuilder = (slice: string) => coreConstantsBuilder('slice')(slice);