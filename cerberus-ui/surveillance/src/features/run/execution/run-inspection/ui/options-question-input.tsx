import {OperationRunQuestionAnswer} from "../../domain/model.ts";

export const OptionsQuestionInput = (props: OperationRunQuestionAnswer) => {
    return (<div>
        <h1>Options</h1>
        {props.question.text}
    </div>)
}
