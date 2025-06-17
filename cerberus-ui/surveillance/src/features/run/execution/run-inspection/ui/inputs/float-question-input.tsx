import { OperationRunQuestionAnswer } from "../../../domain/model.ts";
import { FormInputField } from "@cerberus/core";
import { UseFormReturn } from "react-hook-form";
import { ExecutionForm } from '../../domain/validation.ts';
import { Typography } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { Action, getRequiredActions } from "../../domain/model.ts";
import { useSurveillanceLocales } from "../../../../../../locales/ca/locales.ts";
import { ActionItem } from "../action-item.tsx";

interface FloatQuestionInputProps extends OperationRunQuestionAnswer {
    formMethods: UseFormReturn<ExecutionForm>;
    index: number;
}

export const FloatQuestionInput = (props: FloatQuestionInputProps) => {
    const isMandatory = props.question.isMandatory;
    const { register, formState, setValue, watch } = props.formMethods;
    const fieldPath = `answers.${props.index}`;
    const answerPath = `${fieldPath}.answer` as const;
    const questionIdPath = `${fieldPath}.questionId` as const;
    const [showActions, setShowActions] = useState(false);
    const actionsLabel = useSurveillanceLocales('run.set.optionQuestion.actions');

    const selectedValue = (watch as any)(answerPath);

    const numericValue = selectedValue !== undefined && selectedValue !== ""
        ? Number(selectedValue)
        : undefined;

    const [prevActionsString, setPrevActionsString] = useState("");

    // Función recursiva para preservar el estado de las alternativas
    const preserveActionState = (newAction: any, existingAction: any): any => {
        if (!newAction) return null;

        const result = {
            description: newAction.description,
            executed: existingAction?.executed ?? null,
            comments: existingAction?.comments ?? "",
            alternatives: null
        };

        // Si hay alternativas, procesarlas recursivamente
        if (newAction.alternatives && Array.isArray(newAction.alternatives)) {
            result.alternatives = newAction.alternatives.map((altAction: any, altIndex: number) => {
                const existingAlt = existingAction?.alternatives?.[altIndex];
                return preserveActionState(altAction, existingAlt);
            });
        }

        return result;
    };

    const hasActions = useMemo(
        () => {
            if (numericValue === undefined || isNaN(numericValue)) return false;
            const actions = getRequiredActions(props.question, [numericValue]) || [];
            return actions.length > 0;
        },
        [props.question, numericValue]
    ); useEffect(() => {
        if (numericValue !== undefined && !isNaN(numericValue) && hasActions) {
            setShowActions(true);
            const actions = getRequiredActions(props.question, [numericValue]) || [];
            const currentActions = (props.formMethods.getValues as any)(`${fieldPath}.actions`) || [];

            const combined = actions.map((act, index) => {
                // Preservar valores existentes incluyendo alternativas anidadas
                const existingAction = currentActions[index];
                return preserveActionState(act, existingAction);
            });

            // Solo actualizamos si hay cambios
            const newActionsString = JSON.stringify(combined);
            if (newActionsString !== prevActionsString) {
                setPrevActionsString(newActionsString);
                (setValue as any)(`${fieldPath}.actions`, combined);
            }
        }
        else {
            setShowActions(false);
            const currentActionsString = JSON.stringify(undefined);
            if (currentActionsString !== prevActionsString) {
                setPrevActionsString(currentActionsString);
                (setValue as any)(`${fieldPath}.actions`, undefined);
            }
        }
    }, [props.question, numericValue, hasActions, setValue, fieldPath, prevActionsString]);

    return (
        <>
            <Typography>
                {props.question.text} {isMandatory && <span className="text-error font-bold">*</span>}
            </Typography>
            <FormInputField
                type="number"
                step="0.1"
                className="bg-[#313131] w-full p-2 rounded"
                register={register}
                name={answerPath}
                error={formState.errors?.answers?.[props.index]?.answer}
            />
            <input
                type="hidden"
                {...(register as any)(questionIdPath)}
                defaultValue={props.question.id}
            />
            {showActions && (
                <div className="mt-3">
                    <div className="flex items-center mb-2">
                        <Typography>{actionsLabel}</Typography>
                        <span className="bg-[#313131] block p-[1px] w-auto mb-3"></span>
                    </div>

                    {(watch as any)(`${fieldPath}.actions`)?.map((action: Action, actionIndex: number) => (
                        <ActionItem
                            key={`${fieldPath}-action-${actionIndex}`}
                            action={action}
                            formMethods={props.formMethods}
                            basePath={`${fieldPath}.actions`}
                            index={actionIndex}
                        />
                    ))}
                </div>
            )}
        </>
    )
}