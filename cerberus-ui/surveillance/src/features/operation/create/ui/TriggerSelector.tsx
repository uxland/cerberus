import React from 'react';
import { FormInputField } from "@cerberus/core";
import {
    ValueEqualsSpec,
    ValueGreaterThanSpec,
    ValueLowerThanSpec,
    ValueGreaterThanOrEqualSpec,
    ValueLowerThanOrEqualSpec,
    setTriggerValue,
    IntegerQuestion,
    FloatQuestion
} from "../domain";
import { useSurveillanceLocales } from '../../../../locales/ca/locales';
import { DeleteOutline } from '@mui/icons-material';
import { AnswerIcon } from './icons/answer-icon';

interface TriggerSelectorProps {
    trigger: any;
    triggerIndex: number;
    question: IntegerQuestion | FloatQuestion;
    actions: any;
    onRemoveTrigger: (triggerId: string) => void;
}

export const TriggerSelector: React.FC<TriggerSelectorProps> = ({
    trigger,
    triggerIndex,
    question,
    actions,
    onRemoveTrigger
}) => {
    const triggeLabel = useSurveillanceLocales("operation.create.question.triggers.label");
    const getTriggerOperators = (trigger: any): { equals: boolean; greater: boolean; lower: boolean } => {
        switch (trigger.condition.__type) {
            case 'Equals':
                return { equals: true, greater: false, lower: false };
            case 'GreaterThan':
                return { equals: false, greater: true, lower: false };
            case 'LowerThan':
                return { equals: false, greater: false, lower: true };
            case 'GreaterThanOrEqual':
                return { equals: true, greater: true, lower: false };
            case 'LowerThanOrEqual':
                return { equals: true, greater: false, lower: true };
            default:
                return { equals: false, greater: false, lower: true };
        }
    };

    const handleOperatorToggle = (operator: 'equals' | 'greater' | 'lower') => {
        const currentOperators = getTriggerOperators(trigger);
        const currentValue = (trigger.condition as any).value || 0;

        // Toggle the clicked operator
        const newOperators = {
            ...currentOperators,
            [operator]: !currentOperators[operator]
        };

        // Create new spec based on combination
        let newSpec;
        const { equals, greater, lower } = newOperators;

        if (equals && greater && !lower) {
            newSpec = new ValueGreaterThanOrEqualSpec<number>(currentValue);
        } else if (equals && !greater && lower) {
            newSpec = new ValueLowerThanOrEqualSpec<number>(currentValue);
        } else if (equals && !greater && !lower) {
            newSpec = new ValueEqualsSpec<number>(currentValue);
        } else if (!equals && greater && !lower) {
            newSpec = new ValueGreaterThanSpec<number>(currentValue);
        } else if (!equals && !greater && lower) {
            newSpec = new ValueLowerThanSpec<number>(currentValue);
        } else {
            // Invalid combination, default to the clicked operator only
            if (operator === 'equals') {
                newSpec = new ValueEqualsSpec<number>(currentValue);
            } else if (operator === 'greater') {
                newSpec = new ValueGreaterThanSpec<number>(currentValue);
            } else {
                newSpec = new ValueLowerThanSpec<number>(currentValue);
            }
        }

        // Update the trigger condition
        const updatedQuestion = {
            ...question,
            triggers: question.triggers?.map(t =>
                t.id === trigger.id
                    ? { ...t, condition: newSpec }
                    : t
            )
        };
        actions.setQuestion(question.id, updatedQuestion);
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        actions.setQuestion(
            question.id,
            setTriggerValue(question, trigger.id, newValue)
        );
    };

    const operators = getTriggerOperators(trigger);

    return (
        <div className="">
            <div className="flex items-center gap-2 mt-4 mb-2">
                <div className="flex items-center gap-2">
                    <AnswerIcon className="text-primary w-8 " />
                    <h1 className="font-bold">
                        {triggeLabel} {triggerIndex + 1}
                    </h1>
                </div>
                {/* Botones para toggle de operadores */}
                <div className="flex gap-1">
                    <button
                        type="button"
                        className={`px-2 py-1 text-xs font-bold rounded border ${operators.lower
                            ? 'bg-formSelect text-[#40444C]'
                            : 'text-primary'
                            }`}
                        style={{
                            borderColor: operators.lower ? '#B59019' : '#676E71',
                            backgroundColor: operators.lower ? undefined : '#40444C'
                        }}
                        onClick={() => handleOperatorToggle('lower')}
                    >
                        &lt;
                    </button>
                    <button
                        type="button"
                        className={`px-2 py-1 text-xs font-bold rounded border ${operators.equals
                            ? 'bg-formSelect text-[#40444C]'
                            : 'text-primary'
                            }`}
                        style={{
                            borderColor: operators.equals ? '#B59019' : '#676E71',
                            backgroundColor: operators.equals ? undefined : '#40444C'
                        }}
                        onClick={() => handleOperatorToggle('equals')}
                    >
                        =
                    </button>
                    <button
                        type="button"
                        className={`px-2 py-1 text-xs font-bold rounded border ${operators.greater
                            ? 'bg-formSelect text-[#40444C]'
                            : 'text-primary'
                            }`}
                        style={{
                            borderColor: operators.greater ? '#B59019' : '#676E71',
                            backgroundColor: operators.greater ? undefined : '#40444C'
                        }}
                        onClick={() => handleOperatorToggle('greater')}
                    >
                        &gt;
                    </button>
                </div>

                {/* <span className="text-xs text-gray-600 ml-2">
                    {trigger.condition.__type === 'Equals' && '='}
                    {trigger.condition.__type === 'GreaterThan' && '>'}
                    {trigger.condition.__type === 'LowerThan' && '<'}
                    {trigger.condition.__type === 'GreaterThanOrEqual' && '≥'}
                    {trigger.condition.__type === 'LowerThanOrEqual' && '≤'}
                </span> */}

                <button
                    type="button"
                    onClick={() => onRemoveTrigger(trigger.id)}
                    className={`text-red-500 hover:text-red-700 text-xs p-1 rounded-full ml-auto`}
                >
                    <DeleteOutline />
                </button>
            </div>
            <div className='my-2'>


                <FormInputField
                    type="number"
                    value={(trigger.condition as any).value || 0}
                    onChange={handleValueChange}
                />
            </div>

        </div>
    );
};