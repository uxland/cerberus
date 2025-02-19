import {
    convertQuestionToType, OperationQuestion,
    OperationQuestionType,
    produceQuestion, removeQuestion, setOperationText, setQuestion,
    SurveillanceOperationFormModel
} from "../domain";
import { createOptionsEditor } from "./shared.tsx";
import { InputField } from "@cerberus/core";
import { useState } from "react";
import { Mediator } from "mediatr-ts";
import { CreateOperation } from "../command";
import { notificationService } from "@cerberus/core";

export const SurveillanceOperationForm = ({ initialModel }: { initialModel: SurveillanceOperationFormModel }) => {
    const [model, setModel] = useState<SurveillanceOperationFormModel>(initialModel);


    const handleSubmit = async () => {
        try {
            console.log('description', model.name, 'questions', model.questions);
            const operation = await new Mediator().send(new CreateOperation(model.name, model.questions));
            notificationService.notifySuccess('successMessage');
        } catch (e) {
            notificationService.notifyError('errorMessage', e.message);
            console.error(e.message);
        }

    };
    const handleAddQuestion = (type: OperationQuestionType | undefined) => {
        setModel(produceQuestion(type, model));
    }

    const handleChangeQuestionType = (questionId: string, type: OperationQuestionType) => {
        setModel(convertQuestionToType(model, questionId, type));
    }

    const handleTextChange = (text: string) => {
        setModel(setOperationText(model, text));
    }

    const handleSetQuestion = (questionId: string, question: OperationQuestion) => {
        setModel(setQuestion(model, questionId, question));
    }

    const handleRemoveQuestion = (questionId: string) => {
        setModel(removeQuestion(model, questionId));
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 bg-tableBg py-4 px-6 rounded-[10px] w-full">
                <h1 className="font-bold text-primary">Creación de Operativa - </h1>
                <InputField
                    title=""
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder="Añade el nombre de tu nueva operativa"
                    value={model.name}
                />
            </div>
            {model.questions.map((q) =>
                createOptionsEditor(q, {
                    setQuestion: (questionId: string, question: OperationQuestion) => handleSetQuestion(questionId, question),
                    changeQuestionType: (questionId: string, type: OperationQuestionType) => handleChangeQuestionType(questionId, type),
                    removeQuestion: handleRemoveQuestion,
                }))}
            <div className="flex gap-4">
                <button
                    type="button"
                    className="text-xs uppercase bg-formSelect text-black font-bold py-2 px-8 rounded-full hover:bg-formSelectHover"
                    onClick={() => (handleAddQuestion(undefined))}
                >
                    + Añadir pregunta
                </button>
                <button
                    type="button"
                    className="text-xs uppercase bg-[#313131] text-white font-bold py-2 px-8 rounded-full hover:bg-[#505050]">
                    Previsualizar
                </button>
            </div>
            <button
                onClick={handleSubmit}
                type="button"
                className="flex text-xs uppercase bg-secondary text-white font-bold py-2 px-8 rounded-full ml-auto hover:bg-secondaryHover">
                Proceder
            </button>
        </div>
    );
}