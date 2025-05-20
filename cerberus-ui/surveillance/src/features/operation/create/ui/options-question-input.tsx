import { FormInputField, Select } from "@cerberus/core";
import React from "react";
import { OptionsQuestion, appendOption, removeOption, appendActionToOption, removeActionFromOption, appendAlternativeToAction, removeAlternativeFromAction } from "../domain";
import { GenericQuestionInput } from "./generic-question-input";
import { OperationQuestionActions } from "./shared.tsx";
import { useSurveillanceLocales } from "../../../../locales/ca/locales.ts";
import { AlternativeItem } from "./options-alternative-item";
import AnomalousSwitch from "./anomalousSwitch.tsx";
import { AnswerIcon } from "./icons/answer-icon.tsx";
import { Controller } from "react-hook-form";
interface OptionsQuestionInputProps {
    question: OptionsQuestion;
    actions: OperationQuestionActions;
}

export const OptionsQuestionInput: React.FC<OptionsQuestionInputProps> = ({ question, actions }) => {
    const questionOptionTitle = useSurveillanceLocales("operation.create.question.option.title");
    const questionOptionDelete = useSurveillanceLocales("operation.create.question.option.delete");
    const questionOptionAddOption = useSurveillanceLocales("operation.create.question.option.addOption");
    const questionOptionIsAnomalous = useSurveillanceLocales("operation.create.question.option.isAnomalous");
    const questionAction = useSurveillanceLocales("operation.create.question.actions.anomalousAction");
    const questionAddAction = useSurveillanceLocales("operation.create.question.actions.addAction");
    const addAlternativeLabel = useSurveillanceLocales("operation.create.question.actions.addAlternative");

    const { formState: { errors } } = actions.formMethods;

    const handleAppendOption = () => {
        actions.setQuestion(question.id, appendOption(question, undefined));
    };
    const handleRemoveOption = (optionCode: string) => {
        actions.setQuestion(question.id, removeOption(question, optionCode));
    };

    const handleAppendActionToOption = (optionCode: string) => {
        actions.setQuestion(question.id, appendActionToOption(question as OptionsQuestion, optionCode));
    };

    const handleRemoveActionFromOption = (optionCode: string, instructionIndex: number) => {
        actions.setQuestion(question.id, removeActionFromOption(question as OptionsQuestion, optionCode, instructionIndex));
    };

    const handleAppendAlternative = (optCode: string, actionIdx: number) => {
        actions.setQuestion(
            question.id,
            appendAlternativeToAction(question as OptionsQuestion, optCode, actionIdx)
        );
    };

    console.log("errors", errors)
    return (
        <div>
            <GenericQuestionInput question={question} actions={actions} />

            {question.__type === "Options" && (
                <div>
                    {question.options.map((option, index) => (
                        <div key={option.code} className="border-t-2 border-[#4a4a4a] pt-4 mt-4">
                            <div className="flex items-center mt-2 gap-2">
                                <AnswerIcon className="text-primary w-8 " />
                                <h1 className="font-bold">
                                    {questionOptionTitle} {index + 1}
                                </h1>
                                <Controller
                                    name={`${actions.path}.options.${index}.anomalousSettings.value`}
                                    control={actions.formMethods.control}
                                    defaultValue={option.anomalousSettings?.value}
                                    render={({ field }) => (
                                        <AnomalousSwitch
                                            {...field}
                                            checked={field.value}
                                            onChange={e => field.onChange(e.target.checked)}
                                        />
                                    )}
                                />
                                <span className="text-sm">
                                    {questionOptionIsAnomalous}
                                </span>
                            </div>
                            <div className="flex gap-4 my-2 items-end">

                                <FormInputField
                                    placeholder="..."
                                    register={actions.formMethods.register}
                                    type="text"
                                    name={`${actions.path}.options.${index}.text`}
                                    error={errors[actions.path]?.options?.[index]?.text}
                                    onDelete={() => handleRemoveOption(option.code)}
                                />
                            </div>

                            {option?.anomalousSettings?.value && (
                                <div className="ml-2 mt-2 relative">
                                    {/* Línea vertical principal que conecta todas las acciones */}
                                    {(option.anomalousSettings?.actions ?? []).length > 0 && (
                                        <div className="absolute left-0 top-[-8px] bottom-0 border-l-2 border-[#4a4a4a]"></div>
                                    )}

                                    <button
                                        type="button"
                                        className="text-primary font-bold hover:text-formSelect mt-[5px] text-xs ml-4"
                                        onClick={() => handleAppendActionToOption(option.code)}
                                    >
                                        {questionAddAction}
                                    </button>

                                    {(option.anomalousSettings?.actions ?? []).map((action, actionIndex) => (
                                        <div key={actionIndex} className="mb-6 relative">
                                            <div className="flex gap-2 mb-2 flex-col ml-4">
                                                <div className="w-full mt-2 flex items-center relative">
                                                    {/* Línea horizontal conectora en forma de L para cada acción */}
                                                    <div className="absolute left-[-15px] top-12 w-4 border-t-2 border-[#4a4a4a]"></div>

                                                    <FormInputField
                                                        label={`${questionAction} #${actionIndex + 1}`}
                                                        placeholder="..."
                                                        register={actions.formMethods.register}
                                                        name={`${actions.path}.options.${index}.anomalousSettings.actions.${actionIndex}.description`}
                                                        type="text"
                                                        onDelete={() => handleRemoveActionFromOption(option.code, actionIndex)}
                                                        error={errors[actions.path]?.options?.[index]?.anomalousSettings?.actions?.[actionIndex]?.description}
                                                    />
                                                </div>
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="text-primary font-bold hover:text-formSelect text-xs ml-14 mb-4"
                                                        onClick={() => handleAppendAlternative(option.code, actionIndex)}
                                                    >
                                                        {addAlternativeLabel}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                {(action.alternatives ?? []).map((alt, altIndex) => (
                                                    <div className="ml-6 relative" key={altIndex}>
                                                        {/* Mostrar línea vertical solo si hay una alternativa siguiente (hermano) */}
                                                        {altIndex < action.alternatives.length - 1 && (
                                                            <div className="absolute left-0 top-0 h-full border-l-2 border-[#4a4a4a]"></div>
                                                        )}
                                                        <div className="absolute left-[0px] top-[-54px] w-4 h-24 border-l-2 border-b-2 border-[#4a4a4a]"></div>

                                                        <AlternativeItem
                                                            alternative={alt}
                                                            optionCode={option.code}
                                                            actionIndex={actionIndex}
                                                            path={[altIndex]}
                                                            question={question}
                                                            actions={actions}
                                                            optionIndex={index}
                                                            questionAction={questionAction}
                                                            questionOptionDelete={questionOptionDelete}
                                                            addAlternativeLabel={addAlternativeLabel}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
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