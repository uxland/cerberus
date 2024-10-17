import {Entity} from "@cerberus/shared/src";

export interface Filter extends Entity{
    description: string;
    script: string;
    defaultArgs: unknown;
}