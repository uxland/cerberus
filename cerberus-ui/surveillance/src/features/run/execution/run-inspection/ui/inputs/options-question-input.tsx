import { OperationRunQuestionAnswer } from "../../../domain/model.ts";
import { Select, MultipleSelect } from "@cerberus/core";
import { OptionsQuestion } from "../../../../../operation/create/domain/index.ts";
import { UseFormReturn } from "react-hook-form";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ActionItem } from "../action-item.tsx";

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

    const selectedValue = watch(answerPath);
    const [showActions, setShowActions] = useState(false);

    const selectedOption = question.options?.find(opt => opt.code === selectedValue);
    const hasActions = selectedOption?.anomalousSettings?.actions?.length > 0;

    useEffect(() => {
        if (selectedValue && hasActions) {
            setShowActions(true);
            setValue(`${fieldPath}.actions`,
                selectedOption.anomalousSettings.actions.map(action => ({
                    description: action.description,
                    executed: null,
                    comments: "",
                    alternativeActions: action.alternatives || null
                }))
            );
        } else {
            setShowActions(false);
            setValue(`${fieldPath}.actions`, undefined);
        }
    }, [selectedValue, hasActions, setValue, fieldPath, selectedOption]);

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
                        <Typography>
                            Acciones a realizar:
                        </Typography>
                        <span className="bg-[#313131] block p-[1px] w-full mb-3"></span>
                    </div>

                </div>

            )}
            {showActions && selectedOption?.anomalousSettings?.actions?.map((action, actionIndex) => (

                <ActionItem
                    key={`${fieldPath}-action-${actionIndex}`}
                    action={action}
                    formMethods={props.formMethods}
                    basePath={`${fieldPath}.actions`}
                    index={actionIndex}
                />
            ))}
        </>
    )
}