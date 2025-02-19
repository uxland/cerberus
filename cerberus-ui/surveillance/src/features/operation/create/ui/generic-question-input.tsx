import React from "react";
import {OperationQuestion, OperationQuestionType, questionOptionValues, setQuestionText} from "../domain";
import { OperationQuestionActions } from "./shared.tsx";
import { FormInputField, Select } from "@cerberus/core";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useFormContext } from "react-hook-form";

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

    const formContext = useFormContext();

    if (!formContext) {
        console.error("`useFormContext()` is null. Ensure Select is inside `FormProvider`.");
        return null; // Avoid rendering if form context is missing
    }

    const { register, formState:{errors} } = formContext;

    return (
        <div key={question.id}>
            <div className="flex gap-4 justify-between items-center">
                <h1 className="font-bold">Pregunta {question.id} </h1>
                <button onClick={handleRemoveQuestion} className='flex bg-red-500 p-1 rounded-full hover:bg-red-300 '><DeleteOutlineIcon /></button>
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
                />
              {/*  <Select
                    title="Obligatoriedad"
                    options={["Sí", "No"]}
                    onSelect={(value) => handleMandatoryChange(value)}
                    selected={question.isMandatory ? "Sí" : "No"}
                />*/}
            </div>
        </div>
    );
};