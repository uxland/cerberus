import { OperationRunQuestionAnswer } from "../../../domain/model.ts";
import { FormInputField } from "@cerberus/core";
import { UseFormReturn } from "react-hook-form";
import { ExecutionForm } from '../../domain/validation.ts';
import { Typography } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { Action, getRequiredActions } from "../../domain/model.ts";
import { useSurveillanceLocales } from "../../../../../../locales/ca/locales.ts";
import { ActionItem } from "../action-item.tsx";

interface IntegerQuestionInputProps extends OperationRunQuestionAnswer {
    formMethods: UseFormReturn<ExecutionForm>;
    index: number;
}

export const IntegerQuestionInput = (props: IntegerQuestionInputProps) => {
    const isMandatory = props.question.isMandatory;
    const { register, formState, setValue, watch } = props.formMethods;
    const fieldPath = `answers.${props.index}`;
    const answerPath = `${fieldPath}.answer` as const;
    const questionIdPath = `answers.${props.index}.questionId` as const;
    const [showActions, setShowActions] = useState(false);
    const actionsLabel = useSurveillanceLocales('run.set.optionQuestion.actions');

    const selectedValue = watch(answerPath);

    const numericValue = selectedValue !== undefined && selectedValue !== ""
        ? Number(selectedValue)
        : undefined;

    const [prevActionsString, setPrevActionsString] = useState("");

    const hasActions = useMemo(
        () => {
            if (numericValue === undefined || isNaN(numericValue)) return false;
            const actions = getRequiredActions(props.question, [numericValue]) || [];
            return actions.length > 0;
        },
        [props.question, numericValue]
    );

    useEffect(() => {
        if (numericValue !== undefined && !isNaN(numericValue) && hasActions) {
            setShowActions(true);
            const actions = getRequiredActions(props.question, [numericValue]) || [];
            const combined = actions.map(act => ({
                description: act.description,
                executed: null,
                comments: "",
                alternatives: act.alternatives || null,
            })
            );

            // Solo actualizamos si hay cambios
            const newActionsString = JSON.stringify(combined);
            if (newActionsString !== prevActionsString) {
                setPrevActionsString(newActionsString);
                setValue(`${fieldPath}.actions`, combined);
            }
        }
        else {
            setShowActions(false);
            const currentActionsString = JSON.stringify(undefined);
            if (currentActionsString !== prevActionsString) {
                setPrevActionsString(currentActionsString);
                setValue(`${fieldPath}.actions`, undefined);
            }
        }
    }, [props.question, numericValue, hasActions, setValue, fieldPath, prevActionsString]); // Usar numericValue

    return (
        <>
            <Typography>
                {props.question.text} {isMandatory && <span className="text-error font-bold">*</span>}
            </Typography>
            <FormInputField
                type="number"
                step="1"
                className="bg-[#313131] w-full p-2 rounded"
                register={register}
                name={answerPath}
                error={formState.errors?.answers?.[props.index]?.answer}
            />
            <input
                type="hidden"
                {...register(questionIdPath)}
                defaultValue={props.question.id}
            />
            {showActions && (
                <div className="mt-3">
                    <div className="flex items-center mb-2">
                        <Typography>{actionsLabel}</Typography>
                        <span className="bg-[#313131] block p-[1px] w-auto mb-3"></span>
                    </div>

                    {watch(`${fieldPath}.actions`)?.map((action: Action, actionIndex: number) => (
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