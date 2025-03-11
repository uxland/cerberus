import {ExecutionStepArgs} from "../model.ts";
import {InspectionRun} from '../domain/model.ts'
import {getQuestionInput} from "./ui";
export interface InspectionRunProps extends ExecutionStepArgs{
    inspection: InspectionRun;
}

export const InspectionRunEditor = (props: InspectionRunProps)=>{
 return(<div>
     {props.inspection.operationRun.answers.map(getQuestionInput)}
 </div>)
}