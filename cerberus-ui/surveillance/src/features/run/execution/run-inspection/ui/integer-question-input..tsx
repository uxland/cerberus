import {OperationRunQuestionAnswer} from "../../domain/model.ts";

export const IntegerQuestionInput = (props: OperationRunQuestionAnswer) =>(
    <div>{props.question.text}</div>
)