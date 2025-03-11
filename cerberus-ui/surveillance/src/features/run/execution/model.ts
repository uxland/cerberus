import {IRequest} from "mediatr-ts";
import {Run} from "./domain/model.ts";

export interface  SurveillanceRun{
    id: string,
    //
}

export type StepExecutor = (command: IRequest<Run>) => void;

export interface ExecutionStepArgs {
    handler: StepExecutor;
}