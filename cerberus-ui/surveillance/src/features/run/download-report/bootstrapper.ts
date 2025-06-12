import {Container} from "inversify";
import {registerCommandHandler} from "@cerberus/core";
import {DownloadReport} from "./command.ts";
import {DownloadReportHandler} from "./handler.ts";

export const useDownloadReport = (container: Container) => {
    registerCommandHandler(DownloadReport, DownloadReportHandler)
    return Promise.resolve(container);
}

export const teardownDownloadReport = (container: Container) => {
    unregisterCommandHandler(DownloadReport);
    return Promise.resolve(container);
}