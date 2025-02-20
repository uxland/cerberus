import { FormInputField, InputField, Select } from "@cerberus/core";
import React from "react";
import { OptionsQuestion, OptionsTypology } from "../domain";
import { appendOption, removeOption, setOptionCode, setOptionText, setTypology } from "../domain";
import { GenericQuestionInput } from "./generic-question-input";
import { OperationQuestionActions } from "./shared.tsx";

export const OptionsQuestionInput = ({
    question,
    actions,
}: {
    question: OptionsQuestion;
    actions: OperationQuestionActions;
}) => {
    const handleAppendOption = () =>
        actions.setQuestion(question.id, appendOption(question, undefined));

    const handleRemoveOption = (optionCode: string) => {
        actions.setQuestion(question.id, removeOption(question, optionCode));
    };


    console.log("question", question);
    return (
        <div>
            <GenericQuestionInput question={question} actions={actions} />
            {question.__type === "Options" && (
                <div>
                    {question.options.map((option, index) => (
                        <div key={option.code}>
                            <h1 className="font-bold mt-2">Respuesta {index + 1}</h1>
                            <div className="flex gap-4 mt-2 items-center">
                                <FormInputField
                                    label="Code"
                                    placeholder="..."
                                    register={actions.formMethods.register}
                                   type={"text"}
                                    name={`${actions.path}.options.${index}.code`}
                                />
                                <FormInputField
                                    label="Text"
                                    placeholder="..."
                                    register={actions.formMethods.register}
                                    type={"text"}
                                    name={`${actions.path}.options.${index}.text`}
                                />
                                <button
                                    type="button"
                                    className="text-xs uppercase bg-formSelect text-black font-bold py-2 px-8 rounded-full hover:bg-formSelectHover"
                                    onClick={() => handleRemoveOption(option.code)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="text-primary font-bold hover:text-formSelect mt-[10px]"
                        onClick={handleAppendOption}
                    >
                        + Añadir respuesta
                    </button>
                </div>
            )}
        </div>
    );
};