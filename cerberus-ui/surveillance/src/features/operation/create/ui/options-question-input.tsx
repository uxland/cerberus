import { FormInputField, Select } from "@cerberus/core";
import React from "react";
import { OptionsQuestion } from "../domain";
import { appendOption, removeOption } from "../domain";
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
    const { formState: { errors } } = actions.formMethods;

    const handleAppendOption = () => {
        actions.setQuestion(question.id, appendOption(question, undefined));
    };
    const handleRemoveOption = (optionCode: string) => {
        actions.setQuestion(question.id, removeOption(question, optionCode));
    };

    console.log("errors", errors)
    return (
        <div>
            <GenericQuestionInput question={question} actions={actions} />

            {question.__type === "Options" && (
                <div>
                    {question.options.map((option, index) => (
                        <div key={option.code} >
                            <div className="flex items-center mt-6">
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