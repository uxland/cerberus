import {
    convertQuestionToType, OperationForm, OperationQuestion,
    OperationQuestionType,
    produceQuestion, setQuestion,
    SurveillanceOperationFormModel
} from "../domain";
import { createQuestionEditor } from "./shared.tsx";
import { FormInputField } from "@cerberus/core";
import { useState, useEffect } from "react";
import { Mediator } from "mediatr-ts";
import { CreateOperation } from "../command";
import { z } from 'zod';
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SurveillanceOperationFormModelSchema } from "../domain";
import { useSurveillanceLocales } from "../../../../locales/ca/locales.ts";

interface SurveillanceOperationFormArgs {
    initialModel?: SurveillanceOperationFormModel;
    onSubmitRequested?: (data: SurveillanceOperationFormModel) => void;
}

export const SurveillanceOperationForm = ({ initialModel, onSubmitRequested }: SurveillanceOperationFormArgs) => {
    const formMethods = useForm<OperationForm>({
        resolver: zodResolver(SurveillanceOperationFormModelSchema),
        defaultValues: initialModel || { name: '', questions: [] }
    });
    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
        watch
    } = formMethods;

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "questions",
        keyName: "__id"
    });

    const operation = watch();

    const onSubmit = async (data: OperationForm) => {
        onSubmitRequested?.(data as SurveillanceOperationFormModel);
    };

    const handleAddQuestion = (type: OperationQuestionType | undefined) => {
        const currentState = watch();
        const question = produceQuestion(type, currentState as SurveillanceOperationFormModel);
        append(question);
    };

    const handleChangeQuestionType = (questionId: string, type: OperationQuestionType) => {
        const question = convertQuestionToType(operation as SurveillanceOperationFormModel, questionId, type);
        updateQuestion(question);
    };

    const handleSetQuestion = (questionId: string, question: OperationQuestion) => {
        updateQuestion(question);
    };

    const updateQuestion = (question: OperationQuestion) => {
        const currentQuestions = (operation.questions as OperationQuestion[]).map(q => q.id === question.id ? question : q);
        setValue('questions', currentQuestions);
        replace([...currentQuestions]);
    };

    const handleRemoveQuestion = (questionId: string) => {
        const index = fields.findIndex((q) => q.id === questionId);
        remove(index);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center gap-2 bg-tableBg py-4 px-6 rounded-[10px] w-full">
                <h1 className="font-bold text-primary">{useSurveillanceLocales("operation.create.title")} - </h1>
                <FormInputField
                    name="name"
                    register={register}
                    placeholder={useSurveillanceLocales("operation.create.placeholder")}
                    error={errors.name}
                    type="text"
                />
            </div>
            {fields.map((q, index) =>
                createQuestionEditor(q, {
                    setQuestion: (questionId: string, question: OperationQuestion) => handleSetQuestion(questionId, question),
                    changeQuestionType: (questionId: string, type: OperationQuestionType) => handleChangeQuestionType(questionId, type),
                    removeQuestion: handleRemoveQuestion,
                    index,
                    path: `questions.${index}`,
                    formMethods
                }))}
            <div className="flex gap-4">
                <button
                    type="button"
                    className="text-xs uppercase bg-formSelect text-black font-bold py-2 px-8 rounded-full hover:bg-formSelectHover"
                    onClick={() => handleAddQuestion(undefined)}
                >
                    {useSurveillanceLocales("operation.create.question.addQuestion")}
                </button>
                <button
                    type="button"
                    className="text-xs uppercase bg-[#313131] text-white font-bold py-2 px-8 rounded-full hover:bg-[#505050]">
                    {useSurveillanceLocales("operation.create.preview")}
                </button>
            </div>
            <button
                type="submit"
                className="flex text-xs uppercase bg-secondary text-white font-bold py-2 px-8 rounded-full ml-auto hover:bg-secondaryHover">
                {useSurveillanceLocales("operation.create.proceed")}
            </button>
        </form>
    );
};