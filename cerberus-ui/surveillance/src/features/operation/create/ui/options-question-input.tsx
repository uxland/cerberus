import { FormInputField, Select } from "@cerberus/core";
import React from "react";
import { OptionsQuestion, appendOption, removeOption, appendInstructionToOption, removeInstructionFromOption } from "../domain";
import { GenericQuestionInput } from "./generic-question-input";
import { OperationQuestionActions } from "./shared.tsx";
import { useSurveillanceLocales } from "../../../../locales/ca/locales.ts";
import { isAnomalousValues } from "../domain";

interface OptionsQuestionInputProps {
    question: OptionsQuestion;
    actions: OperationQuestionActions;
}

export const OptionsQuestionInput: React.FC<OptionsQuestionInputProps> = ({ question, actions }) => {
    const questionOptionTitle = useSurveillanceLocales("operation.create.question.option.title");
    const questionOptionCode = useSurveillanceLocales("operation.create.question.option.code");
    const questionOptionText = useSurveillanceLocales("operation.create.question.option.text");
    const questionOptionDelete = useSurveillanceLocales("operation.create.question.option.delete");
    const questionOptionAddOption = useSurveillanceLocales("operation.create.question.option.addOption");
    const questionOptionIsAnomalous = useSurveillanceLocales("operation.create.question.option.isAnomalous");
    const questionInstruction = useSurveillanceLocales("operation.create.question.option.anomalousInstructions");
    const questionAddInstruction = useSurveillanceLocales("operation.create.question.option.addInstruction");

    const { formState: { errors } } = actions.formMethods;

    const handleAppendOption = () => {
        actions.setQuestion(question.id, appendOption(question, undefined));
    };
    const handleRemoveOption = (optionCode: string) => {
        actions.setQuestion(question.id, removeOption(question, optionCode));
    };

    const handleAppendInstructionToOption = (optionCode: string) => {
        actions.setQuestion(question.id, appendInstructionToOption(question as OptionsQuestion, optionCode));
    };

    const handleRemoveInstructionFromOption = (optionCode: string, instructionIndex: number) => {
        actions.setQuestion(question.id, removeInstructionFromOption(question as OptionsQuestion, optionCode, instructionIndex));
    };

    console.log("errors", errors)
    return (
        <div>
            <GenericQuestionInput question={question} actions={actions} />

            {question.__type === "Options" && (
                <div>
                    {question.options.map((option, index) => (
                        <div key={option.code} className="border-t pt-4 mt-4">
                            <div className="flex items-center mt-2">
                                <h1 className="font-bold">
                                    {questionOptionTitle} {index + 1}
                                </h1>
                            </div>
                            <div className="flex gap-4 my-2 items-end">
                                <FormInputField
                                    label={questionOptionCode}
                                    placeholder="..."
                                    register={actions.formMethods.register}
                                    type="text"
                                    name={`${actions.path}.options.${index}.code`}
                                    error={errors[actions.path]?.options?.[index]?.code}
                                />
                                <FormInputField
                                    label={questionOptionText}
                                    placeholder="..."
                                    register={actions.formMethods.register}
                                    type="text"
                                    name={`${actions.path}.options.${index}.text`}
                                    error={errors[actions.path]?.options?.[index]?.text}
                                />
                                <button
                                    type="button"
                                    className="text-xs uppercase bg-formSelect text-black font-bold py-2 px-8 rounded-full hover:bg-formSelectHover mb-1"
                                    onClick={() => handleRemoveOption(option.code)}
                                >
                                    {questionOptionDelete}
                                </button>
                            </div>
                            <Select
                                name="isAnomalous"
                                title={questionOptionIsAnomalous}
                                path={`${actions.path}.options.${index}`}
                                options={isAnomalousValues.map(m => ({ value: String(m.value), label: m.label }))}
                                selected={String(question.options[index].isAnomalous)}
                                formMethods={actions.formMethods}
                            />
                            {option.isAnomalous && question.instructions < 1 && (
                                <div className="ml-4 mt-2 border-l-2 border-gray-300 pl-4">
                                    {option.instructions?.map((instruction, instrIndex) => (
                                        <div key={instrIndex} className="flex items-center gap-2 mb-2">
                                            <FormInputField
                                                label={`${questionInstruction} #${instrIndex + 1}`}
                                                placeholder="..."
                                                register={actions.formMethods.register}
                                                name={`${actions.path}.options.${index}.instructions.${instrIndex}.text`}
                                                type="text"
                                                error={errors[actions.path]?.options?.[index]?.instructions?.[instrIndex]?.text}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveInstructionFromOption(option.code, instrIndex)}
                                                className="text-red-500 hover:text-red-700 text-xs p-1 rounded-full"
                                            >
                                                {questionOptionDelete}
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="text-primary font-bold hover:text-formSelect mt-[5px] text-xs"
                                        onClick={() => handleAppendInstructionToOption(option.code)}
                                    >
                                        {questionAddInstruction}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        className="text-primary font-bold hover:text-formSelect mt-[10px]"
                        onClick={handleAppendOption}
                    >
                        {questionOptionAddOption}
                    </button>
                </div>
            )}
        </div>
    );
};