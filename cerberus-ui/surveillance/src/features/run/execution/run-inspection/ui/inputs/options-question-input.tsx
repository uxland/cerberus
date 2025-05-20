import { OperationRunQuestionAnswer } from "../../../domain/model.ts";
import { Select, MultipleSelect } from "@cerberus/core";
import { OptionsQuestion } from "../../../../../operation/create/domain/index.ts";
import { UseFormReturn } from "react-hook-form";
import { Typography } from "@mui/material";
import { useMemo, useEffect, useState } from "react";
import { ActionItem } from "../action-item.tsx";
import { useSurveillanceLocales } from "../../../../../../locales/ca/locales.ts";
import { type Action } from "../../domain/model.ts";
interface OptionsQuestionInputProps extends OperationRunQuestionAnswer {
    formMethods: UseFormReturn<any>;
    index: number;
}

export const OptionsQuestionInput = (props: OptionsQuestionInputProps) => {
    const isMandatory = props.question.isMandatory;
    const { register, watch, setValue, formState } = props.formMethods;
    const question = props.question as OptionsQuestion;
    const fieldPath = `answers.${props.index}`;
    const questionIdPath = `${fieldPath}.questionId` as const;
    const answerPath = `${fieldPath}.answer`;
    const [showActions, setShowActions] = useState(false);
    const actionsLabel = useSurveillanceLocales('run.set.optionQuestion.actions');

    const selectedValue = watch(answerPath);                   // string | string[]
    const selectedCodes = Array.isArray(selectedValue)
        ? selectedValue
        : selectedValue
            ? [selectedValue]
            : [];

    const selectedOptions = useMemo(
        () => question.options.filter(opt => selectedCodes.includes(opt.code)),
        [question.options, selectedCodes.join(",")]
    );

    const hasActions = useMemo(
        () => selectedOptions.some(opt => (opt.anomalousSettings?.actions?.length ?? 0) > 0),
        [selectedOptions]
    );

    useEffect(() => {
        if (selectedCodes.length > 0 && hasActions) {
            setShowActions(true);

            const combined = selectedOptions.flatMap(opt =>
                opt.anomalousSettings!.actions.map(act => ({
                    description: act.description,
                    executed: null,
                    comments: "",
                    alternatives: act.alternatives || null,
                }))
            );

            setValue(`${fieldPath}.actions`, combined);
        }
        else {
            setShowActions(false);
            setValue(`${fieldPath}.actions`, undefined);
        }
    }, [selectedCodes.join(","), hasActions, setValue, fieldPath]);

    return (
        <>
            <Typography>
                {question.text} {isMandatory && <span className="text-error font-bold">*</span>}
            </Typography>
            {question.type === "Multiple" ? (
                <MultipleSelect
                    formMethods={props.formMethods}
                    name={"answer"}
                    path={fieldPath}
                    title={''}
                    options={question.options.map(option => ({
                        value: option.code,
                        label: option.text
                    })) || []}
                    error={formState.errors?.answers?.[props.index]?.answer}
                />
            ) : (<Select
                formMethods={props.formMethods}
                name={"answer"}
                path={fieldPath}
                title={''}
                options={question.options.map(option => ({
                    value: option.code,
                    label: option.text
                })) || []}
                error={formState.errors?.answers?.[props.index]?.answer}
            />)}
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
