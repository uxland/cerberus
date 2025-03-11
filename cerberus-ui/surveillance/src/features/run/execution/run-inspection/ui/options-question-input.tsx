import {OperationRunQuestionAnswer} from "../../domain/model.ts";

export const OptionsQuestionInput = (props: OperationRunQuestionAnswer) => {
    return (<div>{props.question.text}</div>)
}
