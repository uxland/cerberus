import {registerCommandHandler} from "@cerberus/core";
import {ReleaseRun} from "./command.ts";
import {ReleaseRunHandler} from "./release-run-handler.ts";

export const useReleaseRun = (container) =>{
    registerCommandHandler(ReleaseRun, ReleaseRunHandler);
    return Promise.resolve(container);
}