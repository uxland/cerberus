import {OperationQuestionActions} from "./shared.tsx";
import {OptionsQuestion, OptionsTypology} from "../domain";
import {GenericQuestionInput} from "./generic-question-input";
import {appendOption, setOptionCode, setOptionText, setTypology} from "../domain/options-question.ts";

export const OptionsQuestionInput = ({question, actions}: { question: OptionsQuestion, actions: OperationQuestionActions }) => {

    const handleAppendQuestion = () => actions.setQuestion(appendOption(question, undefined));
    const handleOptionTextChange = (optionCode: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        actions.setQuestion(setOptionText(question, optionCode, e.target.value));
    const handleOptionCodeChange = (optionCode: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        actions.setQuestion(setOptionCode(question, optionCode, e.target.value));

    const handleSetTipology = (e: React.ChangeEvent<HTMLSelectElement>) => {
        actions.setQuestion(setTypology(question, e.target.value as OptionsTypology));
    }

    return(<GenericQuestionInput question={question} actions={actions}/>)
}