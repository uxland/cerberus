import React from "react";
import { FormInputField } from "@cerberus/core";
import { OperationAction, IntegerQuestion, FloatQuestion, getTriggerIndex, appendNestedAlternative, removeNestedAlternative } from "../domain";
import { OperationQuestionActions } from "./shared";

interface GenericAlternativeItemProps {
    alternative: OperationAction;
    triggerId: string;
    parentActionIndex: number;
    alternativePath: number[];
    level?: number;
    question: IntegerQuestion | FloatQuestion;
    actions: OperationQuestionActions;
    questionAction: string;
    questionOptionDelete: string;
    addAlternativeLabel: string;
}

export const GenericAlternativeItem: React.FC<GenericAlternativeItemProps> = ({
    alternative,
    triggerId,
    parentActionIndex,
    alternativePath,
    level = 0,
    question,
    actions,
    questionAction,
    questionOptionDelete,
    addAlternativeLabel
}) => {
    const currentAlternativeIndex = alternativePath[alternativePath.length - 1];
    const { formState: { errors } } = actions.formMethods;
    const triggerIdx = getTriggerIndex(question, triggerId);

    // Calcular el error dinámicamente para este campo específico
    let fieldError: any;
    if (triggerIdx !== -1) {
        // Acceder a los errores de la pregunta específica
        const questionErrors = errors.questions?.[actions.index];
        if (questionErrors && questionErrors.triggers && Array.isArray(questionErrors.triggers)) {
            const triggerErrors = questionErrors.triggers[triggerIdx];
            if (triggerErrors && triggerErrors.actions && Array.isArray(triggerErrors.actions)) {
                let currentNodeErrors: any = triggerErrors.actions[parentActionIndex];
                
                // Navegar por el path de alternativas
                for (const pathSegment of alternativePath) {
                    if (currentNodeErrors && currentNodeErrors.alternatives && Array.isArray(currentNodeErrors.alternatives)) {
                        currentNodeErrors = currentNodeErrors.alternatives[pathSegment];
                    } else {
                        currentNodeErrors = undefined;
                        break;
                    }
                }
                
                if (currentNodeErrors && currentNodeErrors.description) {
                    fieldError = currentNodeErrors.description;
                }
            }
        }
    }

    const handleAddNestedAlternative = () => {
        actions.setQuestion(
            question.id,
            appendNestedAlternative(question, triggerId, parentActionIndex, alternativePath)
        );
    };

    const handleRemoveNestedAlternative = () => {
        actions.setQuestion(
            question.id,
            removeNestedAlternative(question, triggerId, parentActionIndex, alternativePath)
        );
    };

    const fieldNameParts = [
        actions.path,
        "triggers", triggerIdx,
        "actions", parentActionIndex,
    ];
    alternativePath.forEach(index => {
        fieldNameParts.push("alternatives", index);
    });
    fieldNameParts.push("description");
    const fieldName = fieldNameParts.join(".");

    return (
        <div className="relative ml-4">
            <div className="flex items-center gap-2 mb-2">
                {level > 0 && (
                    <div className="absolute left-[-16px] top-[-46px] w-4 h-24 border-l-2 border-b-2 border-[#4a4a4a]"></div>
                )}
                <FormInputField
                    label={`${questionAction} alternativa #${currentAlternativeIndex + 1}`}
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
                            {nestedIdx < (alternative.alternatives?.length ?? 0) - 1 && (
                                <div className="absolute left-[8px] top-0 h-full border-l-2 border-[#4a4a4a]"></div>
                            )}
                            <div className="ml-2">
                                <GenericAlternativeItem
                                    alternative={nestedAlt}
                                    triggerId={triggerId}
                                    parentActionIndex={parentActionIndex}
                                    alternativePath={[...alternativePath, nestedIdx]}
                                    level={level + 1}
                                    question={question}
                                    actions={actions}
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