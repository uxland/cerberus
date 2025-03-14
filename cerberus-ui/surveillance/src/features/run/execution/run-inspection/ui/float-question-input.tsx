import { OperationRunQuestionAnswer } from "../../domain/model.ts";
import { FormInputField } from "@cerberus/core";
import { UseFormReturn } from "react-hook-form";
import { ExecutionForm } from '../domain/validation.ts';

interface FloatQuestionInputProps extends OperationRunQuestionAnswer {
    formMethods: UseFormReturn<ExecutionForm>;
    index: number;
}

export const FloatQuestionInput = (props: FloatQuestionInputProps) => {
    const { register, formState } = props.formMethods;
    const fieldPath = `answers.${props.index}.answer`;
    const questionIdPath = `answers.${props.index}.questionId` as const;

    return (
        <>
            {props.question.text}

            <FormInputField
                type="number"
                step="0.1"
                className="bg-[#313131] w-full p-2 rounded"
                register={register}
                name={fieldPath}
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