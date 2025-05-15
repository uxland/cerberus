import React from "react";
import { OperationQuestion, OperationQuestionType, questionOptionValues, isMandatoryValues, optionTypologyValues, OptionsTypology } from "../domain";
import { OperationQuestionActions } from "./shared.tsx";
import { FormInputField, Select } from "@cerberus/core";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useSurveillanceLocales } from "../../../../locales/ca/locales.ts";
import { IntegerQuestion, FloatQuestion } from "../domain/model";
import {
    appendLowerAlternative,
    removeLowerAlternative,
    appendUpperAlternative,
    removeUpperAlternative,
    appendLowerBoundAction,
    removeLowerBoundAction,
    appendUpperBoundAction,
    removeUpperBoundAction
} from "../domain/model";
import { GenericAlternativeItem } from "./generic-alternative-item";
import { QuestionIcon } from "./icons/question-icon.tsx";

interface GenericQuestionInputProps {
    question: OperationQuestion;
    actions: OperationQuestionActions;
}

export const GenericQuestionInput: React.FC<GenericQuestionInputProps> = ({ question, actions }) => {
    const normalityRange = useSurveillanceLocales("operation.create.question.normalityRange")
    const lowerBoundPlaceholder = useSurveillanceLocales("operation.create.question.lowerBoundPlaceholder")
    const upperBoundPlaceholder = useSurveillanceLocales("operation.create.question.upperBoundPlaceholder")

    const questionAction = useSurveillanceLocales("operation.create.question.actions.anomalousAction");
    const questionAddAction = useSurveillanceLocales("operation.create.question.actions.addAction");
    const addAlternativeLabel = useSurveillanceLocales("operation.create.question.actions.addAlternative");
    const questionOptionDelete = useSurveillanceLocales("operation.create.question.actions.delete");


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

    const handleAppendLowerAction = () =>
        actions.setQuestion(
            question.id,
            appendLowerBoundAction(question as IntegerQuestion | FloatQuestion)
        );
    const handleRemoveLowerAction = (actionindex: number) =>
        actions.setQuestion(
            question.id,
            removeLowerBoundAction(question as IntegerQuestion | FloatQuestion, actionindex)
        );
    const handleAppendLowerAlternative = (actionindex: number) =>
        actions.setQuestion(
            question.id,
            appendLowerAlternative(question as IntegerQuestion | FloatQuestion, actionindex)
        );
    const handleRemoveLowerAlternative = (actionindex: number, alternativeindex: number) =>
        actions.setQuestion(
            question.id,
            removeLowerAlternative(question as IntegerQuestion | FloatQuestion, actionindex, alternativeindex)
        );

    // --- Handlers para upperBound ---
    const handleAppendUpperAction = () =>
        actions.setQuestion(
            question.id,
            appendUpperBoundAction(question as IntegerQuestion | FloatQuestion)
        );
    const handleRemoveUpperAction = (actionindex: number) =>
        actions.setQuestion(
            question.id,
            removeUpperBoundAction(question as IntegerQuestion | FloatQuestion, actionindex)
        );
    const handleAppendUpperAlternative = (actionindex: number) =>
        actions.setQuestion(
            question.id,
            appendUpperAlternative(question as IntegerQuestion | FloatQuestion, actionindex)
        );
    const handleRemoveUpperAlternative = (actionindex: number, alternativeindex: number) =>
        actions.setQuestion(
            question.id,
            removeUpperAlternative(question as IntegerQuestion | FloatQuestion, actionindex, alternativeindex)
        );

    console.log("question", question);

    const { register, formState: { errors } } = actions.formMethods;
    return (
        <div key={question.id}>
            <div className="flex items-center mt-2 gap-2">
                <QuestionIcon className="text-primary w-8" />
                <h1 className="font-bold">{useSurveillanceLocales("operation.create.question.title")} {question.id}</h1>
                <button
                    type="button"
                    onClick={handleRemoveQuestion}
                    className="flex bg-red-500 p-1 rounded-full hover:bg-red-300 ml-auto"
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



            {question.__type !== "Options" && question.__type !== "Text" && (
                <>
                    <div className="mt-4 border-t pt-4">
                        <h1 className="font-bold">{normalityRange}</h1>
                        <div className="grid grid-cols-2 gap-6">
                            {/* LOWER BOUND - Columna independiente con scroll */}
                            <div className="flex flex-col ">
                                <div className="">
                                    <FormInputField
                                        name={`${actions.path}.normalityRange.lowerBound.value`}
                                        type="number"
                                        register={register}
                                        placeholder={lowerBoundPlaceholder}
                                        error={errors[actions.path]?.normalityRange?.lowerBound?.value}
                                    />
                                </div>
                                <div className="overflow-y-auto  p-3">
                                    <div className="border-l-2 border-gray-300 pl-4">
                                        {(question.normalityRange?.lowerBound?.actions ?? []).map((action, actionindex) => (
                                            <div key={actionindex} className="mb-4">
                                                {/* descripción + borrar acción */}
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FormInputField
                                                        label={`${questionAction} #${actionindex + 1}`}
                                                        placeholder="..."
                                                        register={actions.formMethods.register}
                                                        name={`${actions.path}.normalityRange.lowerBound.actions.${actionindex}.description`}
                                                        type="text"
                                                        error={errors[actions.path]?.normalityRange?.lowerBound?.actions?.[actionindex]?.description}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveLowerAction(actionindex)}
                                                        className="text-red-500 hover:text-red-700 text-xs p-1 rounded-full"
                                                    >
                                                        {questionOptionDelete}
                                                    </button>
                                                </div>
                                                {/* alternativas anidadas */}
                                                {(action.alternatives ?? []).map((alt, altIndex) => (
                                                    <GenericAlternativeItem
                                                        key={altIndex}
                                                        alternative={alt}
                                                        boundType="lowerBound"
                                                        actionIndex={actionindex}
                                                        path={[altIndex]}
                                                        level={0}
                                                        question={question as IntegerQuestion | FloatQuestion}
                                                        actions={actions}
                                                        questionAction={questionAction}
                                                        questionOptionDelete={questionOptionDelete}
                                                        addAlternativeLabel={addAlternativeLabel}
                                                    />
                                                ))}
                                                <button
                                                    type="button"
                                                    className="text-primary font-bold hover:text-formSelect text-xs ml-6"
                                                    onClick={() => handleAppendLowerAlternative(actionindex)}
                                                >
                                                    {addAlternativeLabel}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="text-primary font-bold hover:text-formSelect text-xs w-full"
                                    onClick={handleAppendLowerAction}
                                >
                                    {questionAddAction}
                                </button>
                            </div>

                            {/* UPPER BOUND - Columna independiente con scroll */}
                            <div className="flex flex-col ">
                                <div className="">
                                    <FormInputField
                                        name={`${actions.path}.normalityRange.upperBound.value`}
                                        type="number"
                                        register={register}
                                        placeholder={upperBoundPlaceholder}
                                        error={errors[actions.path]?.normalityRange?.upperBound?.value}
                                    />
                                </div>
                                <div className="overflow-y-auto p-3">
                                    <div className="border-l-2 border-gray-300 pl-4">
                                        {(question.normalityRange?.upperBound?.actions ?? []).map((action, actionindex) => (
                                            <div key={actionindex} className="mb-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FormInputField
                                                        label={`${questionAction} #${actionindex + 1}`}
                                                        placeholder="..."
                                                        register={actions.formMethods.register}
                                                        name={`${actions.path}.normalityRange.upperBound.actions.${actionindex}.description`}
                                                        type="text"
                                                        error={errors[actions.path]?.normalityRange?.upperBound?.actions?.[actionindex]?.description}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveUpperAction(actionindex)}
                                                        className="text-red-500 hover:text-red-700 text-xs p-1 rounded-full"
                                                    >
                                                        {questionOptionDelete}
                                                    </button>
                                                </div>
                                                {(action.alternatives ?? []).map((alt, altIndex) => (
                                                    <GenericAlternativeItem
                                                        key={altIndex}
                                                        alternative={alt}
                                                        boundType="upperBound"
                                                        actionIndex={actionindex}
                                                        path={[altIndex]}
                                                        level={0}
                                                        question={question as IntegerQuestion | FloatQuestion}
                                                        actions={actions}
                                                        questionAction={questionAction}
                                                        questionOptionDelete={questionOptionDelete}
                                                        addAlternativeLabel={addAlternativeLabel}
                                                    />
                                                ))}
                                                <button
                                                    type="button"
                                                    className="text-primary font-bold hover:text-formSelect text-xs ml-6"
                                                    onClick={() => handleAppendUpperAlternative(actionindex)}
                                                >
                                                    {addAlternativeLabel}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="text-primary font-bold hover:text-formSelect text-xs w-full"
                                    onClick={handleAppendUpperAction}
                                >
                                    {questionAddAction}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};