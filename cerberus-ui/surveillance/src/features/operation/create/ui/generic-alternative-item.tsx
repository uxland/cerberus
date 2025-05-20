import React from "react";
import { FormInputField } from "@cerberus/core";
import { OperationAction, IntegerQuestion, FloatQuestion } from "../domain/model";
import { OperationQuestionActions } from "./shared";


interface GenericAlternativeItemProps {
    alternative: OperationAction;
    boundType: 'lowerBound' | 'upperBound';
    actionIndex: number;
    path: number[];
    level?: number;
    question: IntegerQuestion | FloatQuestion;
    actions: OperationQuestionActions;
    questionAction: string;
    questionOptionDelete: string;
    addAlternativeLabel: string;
}

export const GenericAlternativeItem: React.FC<GenericAlternativeItemProps> = ({
    alternative,
    boundType,
    actionIndex,
    path,
    level = 0,
    question,
    actions,
    questionAction,
    questionOptionDelete,
    addAlternativeLabel
}) => {
    const altIndex = path[path.length - 1];
    const { formState: { errors } } = actions.formMethods;

    console.log(`Rendering ${boundType} alternative at path: ${path.join('-')}, level: ${level}`);

    const handleAddNestedAlternative = () => {
        console.log(`Adding nested alternative to ${boundType} at path: ${path.join('-')}`);
        /*actions.setQuestion(
            question.id,
            boundType === 'lowerBound'
                ? appendNestedLowerAlternative(question, actionIndex, path)
                : appendNestedUpperAlternative(question, actionIndex, path)
        );*/
    };

    const handleRemoveNestedAlternative = () => {
        console.log(`Removing ${boundType} alternative at path: ${path.join('-')}`);
   /*     actions.setQuestion(
            question.id,
            boundType === 'lowerBound'
                ? removeNestedLowerAlternative(question, actionIndex, path)
                : removeNestedUpperAlternative(question, actionIndex, path)
        );*/
    };

    const fieldName = `${actions.path}.normalityRange.${boundType}.actions.${actionIndex}.alternatives.${path.join('.alternatives.')}.description`;

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
                    error={errors[actions.path]?.normalityRange?.[boundType]?.actions?.[actionIndex]?.alternatives?.[path[0]]?.description}
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
                <GenericAlternativeItem
                    key={nestedIdx}
                    alternative={nestedAlt}
                    boundType={boundType}
                    actionIndex={actionIndex}
                    path={[...path, nestedIdx]}
                    level={level + 1}
                    question={question}
                    actions={actions}
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