import {OperationQuestion, OperationQuestionType, setQuestionText} from "../domain";
import {OperationQuestionActions} from "./shared.tsx";

export const GenericQuestionInput = ({question, actions}: { question: OperationQuestion, actions: OperationQuestionActions }) => {
    //Input per editar el text de la pregunta
    //Input per marcar si la pregunta és obligatòria

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        actions.setQuestion( setQuestionText(question, e.target.value) );
    }
    const handleMandatoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        actions.setQuestion( {...question, isMandatory: e.target.checked} );
    }
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        actions.changeQuestionType(question, e.target.value as OperationQuestionType);
    }
    return<div>fddffdd</div>
}