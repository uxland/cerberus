import {constantBuilder, moduleNames} from '@cerberus/core';
import {coreModuleName} from "@cerberus/core/src/constants/core-constants.ts";

export const moduleName = moduleNames.organizationalStructure;
const coreConstantsBuilder = (suffix: string, sperator?: string) =>
    constantBuilder(coreModuleName, suffix, sperator);

export const sliceBuilder = (slice: string) => coreConstantsBuilder('slice')(slice);