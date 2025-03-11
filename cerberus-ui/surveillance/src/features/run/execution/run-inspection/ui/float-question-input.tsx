import {OperationRunQuestionAnswer} from "../../domain/model.ts";

export const FloatQuestionInput = (props: OperationRunQuestionAnswer) =>{
    return (<div>{props.question.text}</div>)
}