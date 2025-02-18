import {useState} from "react";
import {
    convertQuestionToType, OperationQuestion,
    OperationQuestionType,
    produceQuestion, setOperationText, setQuestion,
    SurveillanceOperationFormModel
} from "../domain";
import {createOptionsEditor} from "./shared.tsx";

export const SurveillanceOperationForm = ({initialModel}: {initialModel: SurveillanceOperationFormModel}) =>{
    const [model, setModel] = useState<SurveillanceOperationFormModel>(initialModel);

    const handleAddQuestion = (type: OperationQuestionType | undefined) =>{
        setModel(produceQuestion(type, model));
    }
    const handleChangeQuestionType = (questionId: string, type: OperationQuestionType) =>
        setModel(convertQuestionToType(model, questionId, type));
   const handleTextChange = (text: string) => setModel(setOperationText(model, text));

   const handleSetQuestion = (questionId: string, question: OperationQuestion) => setModel(setQuestion(model, questionId, question));

    return (
        <div>
            <div>Surveillance editor</div>
            {model.questions.map((q) =>
                createOptionsEditor(q, { setQuestion: handleSetQuestion, changeQuestionType: handleChangeQuestionType })
            )}
        </div>
    );
}
