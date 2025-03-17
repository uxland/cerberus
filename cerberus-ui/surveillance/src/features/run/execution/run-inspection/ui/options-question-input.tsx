import { OperationRunQuestionAnswer } from "../../domain/model.ts";
import { Select } from "@cerberus/core";
import { OptionsQuestion } from "../../../../operation/create/domain";
import { UseFormReturn } from "react-hook-form";
import { Typography } from "@mui/material";

interface OptionsQuestionInputProps extends OperationRunQuestionAnswer {
    formMethods: UseFormReturn<any>;
    index: number;
}

export const OptionsQuestionInput = (props: OptionsQuestionInputProps) => {
    const isMandatory = props.question.isMandatory;
    const { register, formState } = props.formMethods;
    const question = props.question as OptionsQuestion;
    const fieldPath = `answers.${props.index}`;
    const questionIdPath = `answers.${props.index}.questionId` as const;

    return (
        <>
            <Typography>
                {question.text} {isMandatory && <span className="text-error font-bold">*</span>}
            </Typography>
            <Select
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
            <input
                type="hidden"
                {...register(questionIdPath)}
                defaultValue={props.question.id}
            />
        </>
    )
}