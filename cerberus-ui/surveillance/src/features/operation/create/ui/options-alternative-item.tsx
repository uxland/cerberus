import React from "react";
import { FormInputField } from "@cerberus/core";
import { OperationAction, OptionsQuestion } from "../domain";
import { OperationQuestionActions } from "./shared";
import { appendNestedAlternative, getTriggerIndex, removeNestedAlternative } from "../domain";

interface AlternativeItemProps {
    alternative: OperationAction;
    optionCode: string;
    actionIndex: number;
    path: number[];
    level?: number;
    question: OptionsQuestion;
    actions: OperationQuestionActions;
    optionIndex: number;
    questionAction: string;
    questionOptionDelete: string;
    addAlternativeLabel: string;
}

export const AlternativeItem: React.FC<AlternativeItemProps> = ({
    alternative,
    optionCode,
    actionIndex,
    path,
    level = 0,
    question,
    actions,
    optionIndex,
    questionAction,
    questionOptionDelete,
    addAlternativeLabel
}) => {
    const altIndex = path[path.length - 1];
    const { formState: { errors } } = actions.formMethods;
    const triggerIdx = getTriggerIndex(question, optionCode);

    // Calcula dinámicamente el error para este field
    let fieldError: string | undefined;
    const actionsErrors = errors[actions.path]?.triggers?.[triggerIdx]?.actions;
    if (actionsErrors && Array.isArray(actionsErrors)) {
        let node: any = actionsErrors[actionIndex];
        for (const idx of path) {
            node = node?.alternatives?.[idx];
            if (!node) break;
        }
        fieldError = node?.description?.message ?? node?.description;
    }

    const handleAddNestedAlternative = () => {
        actions.setQuestion(
            question.id,
            appendNestedAlternative(question, optionCode, actionIndex, path)
        );
    };

    const handleRemoveNestedAlternative = () => {
        actions.setQuestion(
            question.id,
            removeNestedAlternative(question, optionCode, actionIndex, path)
        );
    };

    const fieldName = [
        actions.path,
        "triggers", triggerIdx,
        "actions", actionIndex,
        ...path.flatMap(idx => ["alternatives", idx]),
        "description"
    ].join(".");

    return (
        <div className="relative ml-4">
            <div className="flex items-center gap-2 mb-2">
                {level > 0 && (
                    <div className="absolute left-[-16px] top-[-46px] w-4 h-24 border-l-2 border-b-2 border-[#4a4a4a]"></div>
                )}
                <FormInputField
                    label={`${questionAction} alternativa #${altIndex + 1}`}
                    placeholder="..."
                    register={actions.formMethods.register}
                    name={fieldName}
                    type="text"
                    onDelete={handleRemoveNestedAlternative}
                    error={fieldError}
                />
            </div>

            <div>
                <button
                    type="button"
                    className="text-primary font-bold hover:text-formSelect text-xs ml-6 mb-4"
                    onClick={handleAddNestedAlternative}
                >
                    {addAlternativeLabel}
                </button>
            </div>

            {(alternative.alternatives || []).length > 0 && (
                <div className="relative">
                    {(alternative.alternatives || []).map((nestedAlt, nestedIdx) => (
                        <div className="relative" key={nestedIdx}>
                            {nestedIdx < alternative.alternatives.length - 1 && (
                                <div className="absolute left-[8px] top-0 h-full border-l-2 border-[#4a4a4a]"></div>
                            )}
                            <div className="ml-2">
                                <AlternativeItem
                                    alternative={nestedAlt}
                                    optionCode={optionCode}
                                    actionIndex={actionIndex}
                                    path={[...path, nestedIdx]}
                                    level={level + 1}
                                    question={question}
                                    actions={actions}
                                    optionIndex={optionIndex}
                                    questionAction={questionAction}
                                    questionOptionDelete={questionOptionDelete}
                                    addAlternativeLabel={addAlternativeLabel}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};