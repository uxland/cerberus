import React from "react";
import { OperationQuestionActions } from "./shared.tsx";
import { OptionsQuestion, OptionsTypology } from "../domain";
import { GenericQuestionInput } from "./generic-question-input";
import { appendOption, removeOption, setOptionCode, setOptionText, setTypology } from "../domain/options-question.ts";
import { InputField, Select } from "@cerberus/core";

export const OptionsQuestionInput = ({
    question,
    actions,
}: {
    question: OptionsQuestion;
    actions: OperationQuestionActions;
}) => {
    const handleAppendOption = () =>
        actions.setQuestion(question.id, appendOption(question, undefined));

    const handleOptionTextChange =
        (optionCode: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
            actions.setQuestion(question.id, setOptionText(question, optionCode, e.target.value));

    const handleOptionCodeChange =
        (optionCode: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
            actions.setQuestion(question.id, setOptionCode(question, optionCode, e.target.value));

    const handleSetTipology = (e: React.ChangeEvent<HTMLSelectElement>) => {
        actions.setQuestion(question.id, setTypology(question, e.target.value as OptionsTypology));
    };
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
                                <InputField
                                    title=""
                                    placeholder="..."
                                    value={option.text}
                                    onChange={handleOptionTextChange(option.code)}
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