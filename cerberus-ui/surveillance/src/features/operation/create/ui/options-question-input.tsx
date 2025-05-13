import { FormInputField, Select } from "@cerberus/core";
import React from "react";
import { 
    OptionsQuestion, 
    appendOption, 
    removeOption, 
    setOptionAnomalousSettings,
    appendActionToOption,
    removeActionFromOption,
    appendAlternativeToAction,
    removeAlternativeFromAction,
    appendNestedAlternative,
    removeNestedAlternative
} from "../domain";
import { GenericQuestionInput } from "./generic-question-input";
import { OperationQuestionActions } from "./shared.tsx";
import { useSurveillanceLocales } from "../../../../locales/ca/locales.ts";
import { isAnomalousValues, AnomalousSettings, OperationAction } from "../domain";

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
    const questionActionLabel = useSurveillanceLocales("operation.create.question.option.anomalousAction");
    const questionAddAction = useSurveillanceLocales("operation.create.question.option.addAction");
    const questionAddAlternative = useSurveillanceLocales("operation.create.question.option.addAlternative") || "Añadir alternativa";

    const { formState: { errors } } = actions.formMethods;

    const handleAppendOption = () => {
        actions.setQuestion(question.id, appendOption(question, undefined));
    };
    const handleRemoveOption = (optionCode: string) => {
        actions.setQuestion(question.id, removeOption(question, optionCode));
    };

    const handleToggleAnomalousSettings = (optionCode: string, isAnomalous: boolean) => {
        const option = question.options.find(o => o.code === optionCode);
        if (!option) return;

        if (isAnomalous) {
            // Initialize anomalousSettings with empty actions array
            actions.setQuestion(
                question.id, 
                setOptionAnomalousSettings(question, optionCode, { actions: [] })
            );
        } else {
            // Remove anomalousSettings
            actions.setQuestion(
                question.id, 
                setOptionAnomalousSettings(question, optionCode, undefined)
            );
        }
    };

    const handleAppendActionToOption = (optionCode: string) => {
        actions.setQuestion(question.id, appendActionToOption(question, optionCode));
    };

    const handleRemoveActionFromOption = (optionCode: string, actionIndex: number) => {
        actions.setQuestion(question.id, removeActionFromOption(question, optionCode, actionIndex));
    };

    const handleAppendAlternativeToAction = (optionCode: string, actionIndex: number) => {
        actions.setQuestion(question.id, appendAlternativeToAction(question, optionCode, actionIndex));
    };

    const handleRemoveAlternativeFromAction = (optionCode: string, actionIndex: number, alternativeIndex: number) => {
        actions.setQuestion(question.id, removeAlternativeFromAction(question, optionCode, actionIndex, alternativeIndex));
    };

    const handleAppendNestedAlternative = (optionCode: string, path: number[]) => {
        actions.setQuestion(question.id, appendNestedAlternative(question, optionCode, path));
    };

    const handleRemoveNestedAlternative = (optionCode: string, path: number[], alternativeIndex: number) => {
        actions.setQuestion(question.id, removeNestedAlternative(question, optionCode, path, alternativeIndex));
    };

    // Recursive component to render an action and its alternatives
    interface ActionItemProps {
        action: OperationAction;
        optionCode: string;
        optionIndex: number;
        actionPath: number[];
        level: number;
        basePath: string;
        errors: any;
        register: any;
        onRemove: () => void;
        onAddAlternative: () => void;
    }

    const ActionItem: React.FC<ActionItemProps> = ({ 
        action, 
        optionCode, 
        optionIndex, 
        actionPath, 
        level, 
        basePath, 
        errors, 
        register, 
        onRemove, 
        onAddAlternative 
    }) => {
        const currentIndex = actionPath[actionPath.length - 1];
        const fieldName = `${basePath}${actionPath.map(idx => `.alternatives.${idx}`).join('')}.description`;
        const label = level === 0 
            ? `${questionActionLabel} #${currentIndex + 1}` 
            : `Alternativa #${currentIndex + 1}`;

        return (
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <FormInputField
                        label={label}
                        placeholder={level === 0 ? "Descripción de la acción..." : "Descripción de la alternativa..."}
                        register={register}
                        name={fieldName}
                        type="text"
                        error={errors}
                    />
                    <div className="flex flex-col gap-1">
                        <button
                            type="button"
                            onClick={onRemove}
                            className="text-red-500 hover:text-red-700 text-xs p-1 rounded-full"
                        >
                            {questionOptionDelete}
                        </button>
                        <button
                            type="button"
                            onClick={onAddAlternative}
                            className="text-blue-500 hover:text-blue-700 text-xs p-1 rounded-full"
                        >
                            {questionAddAlternative}
                        </button>
                    </div>
                </div>

                {/* Render alternatives recursively if they exist */}
                {action.alternatives && action.alternatives.length > 0 && (
                    <div className={`ml-8 border-l-2 border-gray-200 pl-4`}>
                        <h4 className="text-sm font-medium mb-2">Alternativas</h4>
                        {action.alternatives.map((alternative, altIndex) => (
                            <ActionItem
                                key={altIndex}
                                action={alternative}
                                optionCode={optionCode}
                                optionIndex={optionIndex}
                                actionPath={[...actionPath, altIndex]}
                                level={level + 1}
                                basePath={basePath}
                                errors={errors}
                                register={register}
                                onRemove={() => handleRemoveNestedAlternative(optionCode, actionPath, altIndex)}
                                onAddAlternative={() => handleAppendNestedAlternative(optionCode, [...actionPath, altIndex])}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
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
                                selected={String(!!option.anomalousSettings)}
                                onChanged={(value) => handleToggleAnomalousSettings(option.code, value)}
                                formMethods={actions.formMethods}
                            />
                            {option.anomalousSettings && (
                                <div className="ml-4 mt-2 border-l-2 border-gray-300 pl-4">
                                    <h3 className="font-semibold mb-2">Acciones en caso de anomalía</h3>
                                    {option.anomalousSettings.actions.map((action, actionIndex) => (
                                        <ActionItem
                                            key={actionIndex}
                                            action={action}
                                            optionCode={option.code}
                                            optionIndex={index}
                                            actionPath={[actionIndex]}
                                            level={0}
                                            basePath={`${actions.path}.options.${index}.anomalousSettings.actions.${actionIndex}`}
                                            errors={errors[actions.path]?.options?.[index]?.anomalousSettings?.actions?.[actionIndex]?.description}
                                            register={actions.formMethods.register}
                                            onRemove={() => handleRemoveActionFromOption(option.code, actionIndex)}
                                            onAddAlternative={() => handleAppendAlternativeToAction(option.code, actionIndex)}
                                        />
                                    ))}
                                    <button
                                        type="button"
                                        className="text-primary font-bold hover:text-formSelect mt-[5px] text-xs"
                                        onClick={() => handleAppendActionToOption(option.code)}
                                    >
                                        {questionAddAction}
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
