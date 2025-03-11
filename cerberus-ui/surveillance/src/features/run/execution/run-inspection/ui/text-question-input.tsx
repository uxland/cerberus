import {OperationRunQuestionAnswer} from "../../domain/model.ts";

export const TextQuestionInput = (props: OperationRunQuestionAnswer) => {
    return (<div>{props.question.text}</div>)
}