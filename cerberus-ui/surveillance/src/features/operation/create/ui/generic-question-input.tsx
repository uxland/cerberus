import React, { useEffect } from "react";
import {
    IntegerQuestion,
    FloatQuestion,
    appendTrigger,
    removeTrigger,
    OperationQuestion,
    OperationQuestionType,
    questionOptionValues,
    isMandatoryValues,
    optionTypologyValues,
    OptionsTypology,
    getTriggerIndex,
    appendActionToQuestion,
    removeActionFromQuestion,
    ValueEqualsSpec,
    ValueGreaterThanSpec,
    ValueLowerThanSpec,
    getTriggerActions,
    appendAction,
    setTriggerValue
} from "../domain";
import { OperationQuestionActions } from "./shared.tsx";
import { FormInputField, Select } from "@cerberus/core";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useSurveillanceLocales } from "../../../../locales/ca/locales.ts";
import { GenericAlternativeItem } from "./generic-alternative-item";
import { QuestionIcon } from "./icons/question-icon.tsx";

interface GenericQuestionInputProps {
    question: OperationQuestion;
    actions: OperationQuestionActions;
}

export const GenericQuestionInput: React.FC<GenericQuestionInputProps> = ({ question, actions }) => {
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

    const handleAppendAction = (triggerId: string) => {
        actions.setQuestion(
            question.id,
            appendActionToQuestion(question, triggerId)
        );
    };

    const handleRemoveAction = (triggerId: string, actionIdx: number) => {
        actions.setQuestion(
            question.id,
            removeActionFromQuestion(question, triggerId, actionIdx)
        );
    };

    const handleAppendAlternative = (triggerId: string, actionIdx: number) => {
        actions.setQuestion(
            question.id,
            appendAction(question, triggerId, [actionIdx])
        );
    };

    const { register, formState: { errors }, watch, getValues } = actions.formMethods;
    const pathForText = `${actions.path}.text`;
    const currentQuestionTextFromRHF = watch(pathForText);

    useEffect(() => {
        const valueFromRHF = getValues(pathForText);
        if (question.text !== valueFromRHF && typeof valueFromRHF === 'string') {
            actions.setQuestion(question.id, { ...question, text: valueFromRHF });
        }
    }, [currentQuestionTextFromRHF, question.id, question.text, actions, getValues, pathForText]);

    const handleAddEqualsTrigger = () => {
        const spec = new ValueEqualsSpec<string>("");
        actions.setQuestion(question.id, appendTrigger(question, spec));
    };

    const handleAddGreaterThanTrigger = () => {
        const spec = new ValueGreaterThanSpec<number>(0);
        actions.setQuestion(question.id, appendTrigger(question, spec));
    };

    const handleAddLowerThanTrigger = () => {
        const spec = new ValueLowerThanSpec<number>(0);
        actions.setQuestion(question.id, appendTrigger(question, spec));
    };

    const handleRemoveTrigger = (triggerId: string) => {
        actions.setQuestion(
            question.id,
            removeTrigger(question, triggerId)
        );
    };

    return (
        <div key={question.id}>
            <div className="flex items-center mt-2 gap-2">
                <QuestionIcon className="text-primary w-8" />
                <h1 className="font-bold">
                    {useSurveillanceLocales("operation.create.question.title")} {question.id}
                </h1>
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
                    {/* 2) Botones para añadir triggers */}
                    <div className="flex gap-2 items-center mt-2 ml-2">
                        <button
                            type="button"
                            className="text-primary font-bold hover:text-formSelect text-xs"
                            onClick={handleAddEqualsTrigger}
                        >
                            Añadir Trigger =
                        </button>
                        <button
                            type="button"
                            className="text-primary font-bold hover:text-formSelect text-xs"
                            onClick={handleAddGreaterThanTrigger}
                        >
                            Añadir Trigger &gt;
                        </button>
                        <button
                            type="button"
                            className="text-primary font-bold hover:text-formSelect text-xs"
                            onClick={handleAddLowerThanTrigger}
                        >
                            Añadir Trigger &lt;
                        </button>
                    </div>

                    <div className="ml-2 mt-2 relative">
                        {/* Línea vertical que conecta todas las acciones */}
                        {(question.triggers?.length ?? 0) > 0 && (
                            <div className="absolute left-0 top-[-8px] bottom-0 border-l-2 border-[#4a4a4a]" />
                        )}

                        {question.triggers?.map((trigger, triggerIndex) => (
                            <React.Fragment key={trigger.id}>
                                <div className=" ml-4">
                                    <div className="flex items-center gap-2 mt-4">
                                        <span className="text-sm font-semibold">Trigger {triggerIndex} :</span>
                                        <button
                                            type="button"
                                            className="text-red-500 hover:text-red-700 text-xs font-bold"
                                            onClick={() => handleRemoveTrigger(trigger.id)}
                                        >
                                            Eliminar Trigger
                                        </button>
                                    </div>
                                    <FormInputField
                                        label="Valor"
                                        type="number"
                                        value={(trigger.condition).value}
                                        onChange={e =>
                                            actions.setQuestion(
                                                question.id,
                                                setTriggerValue(question, trigger.id, Number(e.target.value))
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="text-primary font-bold hover:text-formSelect mt-[5px] text-xs"
                                        onClick={() => handleAppendAction(trigger.id)}
                                    >
                                        {questionAddAction}
                                    </button>
                                </div>
                                {getTriggerActions(question, trigger.id).map((action, actionIndex) => (
                                    <div key={actionIndex} className="mb-6 relative">
                                        <div className="flex gap-2 mb-2 flex-col ml-4">
                                            <div className="w-full mt-2 flex items-center relative">
                                                {/* Línea horizontal conectora en forma de L para cada acción */}
                                                <div className="absolute left-[-15px] top-12 w-4 border-t-2 border-[#4a4a4a]" />

                                                <FormInputField
                                                    label={`${questionAction} #${actionIndex + 1}`}
                                                    placeholder="..."
                                                    register={actions.formMethods.register}
                                                    name={`${actions.path}.triggers.${getTriggerIndex(question, trigger.id)}.actions.${actionIndex}.description`}
                                                    type="text"
                                                    onDelete={() => handleRemoveAction(trigger.id, actionIndex)}
                                                    error={errors[actions.path]?.triggers?.[getTriggerIndex(question, trigger.id)]?.actions?.[actionIndex]?.description}
                                                />
                                            </div>

                                            <div>
                                                <button
                                                    type="button"
                                                    className="text-primary font-bold hover:text-formSelect text-xs ml-14 mb-4"
                                                    onClick={() => handleAppendAlternative(trigger.id, actionIndex)}
                                                >
                                                    {addAlternativeLabel}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Renderizar alternativas anidadas */}
                                        <div className="relative">
                                            {(action.alternatives ?? []).map((alt, altIdx) => (
                                                <div className="ml-6 relative" key={altIdx}>
                                                    {/* Mostrar línea vertical solo si hay una alternativa siguiente (hermano) */}
                                                    {altIdx < action.alternatives.length - 1 && (
                                                        <div className="absolute left-0 top-0 h-full border-l-2 border-[#4a4a4a]" />
                                                    )}
                                                    <div className="absolute left-[0px] top-[-54px] w-4 h-[105px] border-l-2 border-b-2 border-[#4a4a4a]" />

                                                    <GenericAlternativeItem
                                                        key={`${trigger.id}-${actionIndex}-${altIdx}`}
                                                        alternative={alt}
                                                        triggerId={trigger.id}
                                                        parentActionIndex={actionIndex}
                                                        alternativePath={[altIdx]}
                                                        level={0}
                                                        question={question as IntegerQuestion | FloatQuestion}
                                                        actions={actions}
                                                        questionAction={questionAction}
                                                        questionOptionDelete={questionOptionDelete}
                                                        addAlternativeLabel={addAlternativeLabel}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};