import React from "react";
import { OperationQuestion, OperationQuestionType, questionOptionValues, isMandatoryValues, optionTypologyValues, OptionsTypology } from "../domain";
import { OperationQuestionActions } from "./shared.tsx";
import { FormInputField, Select } from "@cerberus/core";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useSurveillanceLocales } from "../../../../locales/ca/locales.ts";
import { appendInstruction, removeInstructionFromQuestion } from "../domain";

interface GenericQuestionInputProps {
    question: OperationQuestion;
    actions: OperationQuestionActions;
}

export const GenericQuestionInput: React.FC<GenericQuestionInputProps> = ({ question, actions }) => {
    const normalityRange = useSurveillanceLocales("operation.create.question.normalityRange")
    const lowerBoundPlaceholder = useSurveillanceLocales("operation.create.question.lowerBoundPlaceholder")
    const upperBoundPlaceholder = useSurveillanceLocales("operation.create.question.upperBoundPlaceholder")

    const questionLevelInstructionsTitle = useSurveillanceLocales("operation.create.question.instructions.title");
    const questionAddInstructionLabel = useSurveillanceLocales("operation.create.question.instructions.addInstruction");
    const questionRemoveInstructionLabel = useSurveillanceLocales("operation.create.question.instructions.removeInstruction");

    const handleTypeChange = (value: OperationQuestionType) => {
        actions.changeQuestionType(question.id, value);
    };
    const handleIsMandatoryChange = (value: string) => {
        actions.setQuestion(question.id, { ...question, isMandatory: value === "true" });
    };

    const handleTypologyChange = (value: string) => {
        actions.setQuestion(question.id, { ...question, type: value as OptionsTypology });
    };

    const handleRemoveQuestion = () => {
        actions.removeQuestion(question.id);
    };

    const handleAppendQuestionInstruction = async () => {
        const updatedQuestion = await appendInstruction(question);
        actions.setQuestion(question.id, updatedQuestion);
    };

    const handleRemoveQuestionInstruction = (instrIndex: number) => {
        actions.setQuestion(question.id, removeInstructionFromQuestion(question, instrIndex));
    };

    console.log("question", question);

    const { register, formState: { errors } } = actions.formMethods;

    return (
        <div key={question.id}>
            <div className="flex gap-4 justify-between items-center">
                <h1 className="font-bold">{useSurveillanceLocales("operation.create.question.title")} {question.id}</h1>
                <button
                    type="button"
                    onClick={handleRemoveQuestion}
                    className="flex bg-red-500 p-1 rounded-full hover:bg-red-300"
                >
                    <DeleteOutlineIcon />
                </button>
            </div>

            <div className="flex flex-row gap-4 mt-2 items-center">
                <FormInputField
                    name={`${actions.path}.text`}
                    placeholder={useSurveillanceLocales("operation.create.question.placeholder")}
                    register={register}
                    type="text"
                    error={errors[actions.path]?.text}
                />
            </div>

            <div className="flex gap-4 my-4">
                <Select
                    title={useSurveillanceLocales("operation.create.question.type")}
                    options={questionOptionValues}
                    selected={question.__type}
                    onChanged={handleTypeChange}
                    formMethods={actions.formMethods}
                />
                <Select
                    title={useSurveillanceLocales("operation.create.question.isMandatory")}
                    options={isMandatoryValues.map(m => ({ value: String(m.value), label: m.label }))}
                    selected={String(question.isMandatory)}
                    onChanged={handleIsMandatoryChange}
                    formMethods={actions.formMethods}
                />
                {question.__type === "Options" && (
                    <Select
                        title={useSurveillanceLocales("operation.create.question.subtype")}
                        options={optionTypologyValues}
                        selected={question.type}
                        onChanged={handleTypologyChange}
                        formMethods={actions.formMethods}
                    />
                )}
            </div>
            {question.__type != "Text" && (
                <div className="mt-4 border-t pt-4">
                    <h1 className="font-semibold mb-2">{questionLevelInstructionsTitle}</h1>
                    {question.instructions?.map((instruction, instrIndex) => (
                        <div key={instrIndex} className="flex items-center gap-2 mb-2">
                            <FormInputField
                                label={`${questionLevelInstructionsTitle} #${instrIndex + 1}`}
                                placeholder="..."
                                register={register}
                                name={`${actions.path}.instructions.${instrIndex}.text`}
                                type="text"
                                error={errors[actions.path]?.instructions?.[instrIndex]?.text}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveQuestionInstruction(instrIndex)}
                                className="text-red-500 hover:text-red-700 text-xs p-1 rounded-full"
                            >
                                {questionRemoveInstructionLabel}
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="text-primary font-bold hover:text-formSelect mt-[5px] text-xs"
                        onClick={handleAppendQuestionInstruction}
                    >
                        {questionAddInstructionLabel}
                    </button>
                </div>
            )}


            {question.__type != "Options" && question.__type != "Text" && (
                <div className="mt-4 border-t pt-4">
                    <h1 className="font-bold">{normalityRange}</h1>
                    <div className="flex gap-2">
                        <FormInputField
                            name={`${actions.path}.normalityRange.lowerBound`}
                            type="number"
                            register={register}
                            placeholder={lowerBoundPlaceholder}
                            error={errors[actions.path]?.normalityRange?.lowerBound}
                        />
                        <FormInputField
                            name={`${actions.path}.normalityRange.upperBound`}
                            type="number"
                            register={register}
                            placeholder={upperBoundPlaceholder}
                            error={errors[actions.path]?.normalityRange?.upperBound}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};