import React from "react";
import { OperationQuestion, OperationQuestionType, setQuestionText } from "../domain";
import { OperationQuestionActions } from "./shared.tsx";
import { InputField, Select } from "@cerberus/core";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface GenericQuestionInputProps {
    question: OperationQuestion;
    actions: OperationQuestionActions;
}

export const GenericQuestionInput: React.FC<GenericQuestionInputProps> = ({ question, actions }) => {
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        actions.setQuestion(question.id, setQuestionText(question, e.target.value));
    };

    const handleMandatoryChange = (value: string) => {
        const isMandatory = value === "Sí";
        actions.setQuestion(question.id, { ...question, isMandatory });
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        actions.changeQuestionType(question.id, e.target.value as OperationQuestionType);
    };

    const handleRemoveQuestion = () => {
        actions.removeQuestion(question.id);
    };

    return (
        <div key={question.id}>
            <div className="flex gap-4 justify-between items-center">
                <h1 className="font-bold">Pregunta {question.id} </h1>
                <button onClick={handleRemoveQuestion} className='flex bg-red-500 p-1 rounded-full hover:bg-red-300 '><DeleteOutlineIcon /></button>
            </div>
            <div className="flex flex-row gap-4 mt-2 items-center">

                <InputField
                    title=""
                    onChange={handleTextChange}
                    placeholder="..."
                    value={question.text}
                />

            </div>
            <div className="flex gap-4 mt-2">
                <Select
                    title="Tipología de respuesta"
                    options={["Options", "Text", "Integer", "Float"]}
                    onSelect={(value) => handleTypeChange({ target: { value } } as any)}
                    selected={question.__type}
                />
                <Select
                    title="Obligatoriedad"
                    options={["Sí", "No"]}
                    onSelect={(value) => handleMandatoryChange(value)}
                    selected={question.isMandatory ? "Sí" : "No"}
                />
            </div>
        </div>
    );
};