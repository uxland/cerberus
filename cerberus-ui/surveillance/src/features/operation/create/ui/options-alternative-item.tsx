import React from "react";
import { FormInputField } from "@cerberus/core";
import { OperationAction, OptionsQuestion } from "../domain";
import { OperationQuestionActions } from "./shared";
import { appendNestedAlternative, removeNestedAlternative } from "../domain/options-question";

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

    console.log(`Rendering alternative at path: ${path.join('-')}, level: ${level}`);

    const handleAddNestedAlternative = () => {
        console.log(`Adding nested alternative to path: ${path.join('-')}`);
        actions.setQuestion(
            question.id,
            appendNestedAlternative(question, optionCode, actionIndex, path)
        );
    };

    const handleRemoveNestedAlternative = () => {
        console.log(`Removing alternative at path: ${path.join('-')}`);
        actions.setQuestion(
            question.id,
            removeNestedAlternative(question, optionCode, actionIndex, path)
        );
    };

    const fieldName = `${actions.path}.options.${optionIndex}.anomalousSettings.actions.${actionIndex}.alternatives.${path.join('.alternatives.')}.description`;

    const marginLeft = 16 + (level * 16);

    return (
        <div style={{ marginLeft: `${marginLeft}px` }}>
            <div className="flex items-center gap-2 mb-2">
                <FormInputField
                    label={`${questionAction} alternativa #${altIndex + 1}`}
                    placeholder="..."
                    register={actions.formMethods.register}
                    name={fieldName}
                    type="text"
                    error={errors[actions.path]?.options?.[optionIndex]?.anomalousSettings?.actions?.[actionIndex]?.alternatives?.[path[0]]?.description}
                />
                <button
                    type="button"
                    onClick={handleRemoveNestedAlternative}
                    className="text-red-500 hover:text-red-700 text-xs p-1 rounded-full"
                >
                    {questionOptionDelete}
                </button>
            </div>

            {(alternative.alternatives || []).map((nestedAlt, nestedIdx) => (
                <AlternativeItem
                    key={nestedIdx}
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
            ))}

            <button
                type="button"
                className="text-primary font-bold hover:text-formSelect text-xs mb-4"
                style={{ marginLeft: `${4}px` }}
                onClick={handleAddNestedAlternative}
            >
                {addAlternativeLabel}
            </button>
        </div>
    );
};