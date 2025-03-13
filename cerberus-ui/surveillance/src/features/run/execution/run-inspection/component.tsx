import {ExecutionStepArgs} from "../model.ts";
import {InspectionRun} from '../domain/model.ts'
import {TextQuestionInput} from "./ui/text-question-input.tsx";
import {getCurrentInspection} from "./model.ts";
import {getQuestionInput} from "./ui";

export interface InspectionRunProps extends ExecutionStepArgs{
    inspection: InspectionRun;
}

export const InspectionRunEditor = ({run}: ExecutionStepArgs)=>{
    const inspection = getCurrentInspection(run);
     return(<ul>
        {inspection?.operationRun.answers.map((answer) =>{
            const QuestionInput = getQuestionInput(answer);
           return  (
                <li key={answer.question.id}>
                    <QuestionInput {...answer}/>
                </li>
            )
        })}
     </ul>)
}