import React from "react";
import {OperationQuestion, OperationQuestionType, questionOptionValues} from "../domain";
import { OperationQuestionActions } from "./shared.tsx";
import { FormInputField, Select } from "@cerberus/core";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface GenericQuestionInputProps {
    question: OperationQuestion;
    actions: OperationQuestionActions;

}

export const GenericQuestionInput: React.FC<GenericQuestionInputProps> = ({ question, actions }) => {
    const handleTypeChange = (value: OperationQuestionType) => {
        actions.changeQuestionType(question.id, value);
    };

    const handleRemoveQuestion = () => {
        actions.removeQuestion(question.id);
    };

    const { register, formState:{errors} } = actions.formMethods;

    return (
        <div key={question.id}>
            <div className="flex gap-4 justify-between items-center">
                <h1 className="font-bold">Pregunta {question.id} </h1>
                <button type={"button"} onClick={handleRemoveQuestion} className='flex bg-red-500 p-1 rounded-full hover:bg-red-300 '><DeleteOutlineIcon /></button>
            </div>
            <div className="flex flex-row gap-4 mt-2 items-center">

                <FormInputField
                    label="Texto de la pregunta"
                    name={`${actions.path}.text`}
                    placeholder="..."
                    register={register}
                    type="text"
                    error={errors[actions.path]?.text}
                />

            </div>
            <div className="flex gap-4 mt-2">
                <Select
                    title="Tipología de respuesta"
                    options = {questionOptionValues}
                    selected={question.__type}
                    onChanged={handleTypeChange}
                    formMethods={actions.formMethods}
                />
            </div>
        </div>
    );
};