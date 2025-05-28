import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box, Alert } from "@mui/material";
import {
    convertQuestionToType, OperationForm, OperationQuestion,
    OperationQuestionType,
    produceQuestion,
    SurveillanceOperationFormModel
} from "../domain";
import { createQuestionEditor } from "./shared.tsx";
import { FormInputField } from "@cerberus/core";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SurveillanceOperationFormModelSchema } from "../domain";
import { useSurveillanceLocales } from "../../../../locales/ca/locales.ts";
import { getValidationErrorSummary } from "../domain";

interface SurveillanceOperationFormArgs {
    initialModel?: SurveillanceOperationFormModel;
    onSubmitRequested?: (data: SurveillanceOperationFormModel) => void;
}

export const SurveillanceOperationForm = ({ initialModel, onSubmitRequested }: SurveillanceOperationFormArgs) => {
    const [activeTab, setActiveTab] = useState(0);
    const [showValidationErrors, setShowValidationErrors] = useState(false);

    const formMethods = useForm<OperationForm>({
        resolver: zodResolver(SurveillanceOperationFormModelSchema),
        defaultValues: initialModel || { description: '', questions: [] },
        mode: "onSubmit", // Cambiamos a onSubmit para evitar validaciones automáticas
        shouldFocusError: false // Deshabilitamos el focus automático
    });
    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
        clearErrors
    } = formMethods;

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "questions",
        keyName: "__id"
    });

    const operation = watch();

    const onSubmit = async (data: OperationForm) => {
        try {
            console.log("Data", data);
            setShowValidationErrors(false);
            await onSubmitRequested?.(data as SurveillanceOperationFormModel);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const onInvalidSubmit = (formErrors: any) => {
        console.error("Validation failed:", formErrors);
        setShowValidationErrors(true);
    };

    const handleAddQuestion = (type: OperationQuestionType | undefined) => {
        const currentState = watch();
        const question = produceQuestion(type, currentState as SurveillanceOperationFormModel);
        append(question);
        setActiveTab(fields.length); // selecciona la nueva pestaña
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
    };

    const handleRemoveQuestion = (questionId: string) => {
        const idx = fields.findIndex(q => q.id === questionId);
        remove(idx);
        setActiveTab(prev => Math.max(0, prev - 1)); // ajusta la pestaña activa
    };

    const formValues = formMethods.watch();

    useEffect(() => {
        console.log("Modelo del formulario actualizado:", formValues);
    }, [formValues]);

    const validationErrors = getValidationErrorSummary(errors);

    // Consolidar en un solo useEffect para manejar la ocultación automática de errores
    useEffect(() => {
        if (showValidationErrors && validationErrors.length === 0) {
            // Usar un pequeño delay para suavizar la transición
            const timer = setTimeout(() => {
                setShowValidationErrors(false);
            }, 150); // 150ms delay para una transición más suave

            return () => clearTimeout(timer);
        }
    }, [validationErrors.length, showValidationErrors]);

    // Efecto para limpiar errores cuando se corrigen los campos
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name && name.includes('.text') && value) {
                // Si el campo de texto se llena, limpiar su error específico
                const fieldPath = name.replace('.text', '');
                clearErrors(name as any);
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, clearErrors]);

    return (
        <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="space-y-6" noValidate>
            {/* Mostrar errores de validación con transición suave */}
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${showValidationErrors && validationErrors.length > 0
                    ? 'max-h-96 opacity-100 mb-4'
                    : 'max-h-0 opacity-0 mb-0'
                    }`}
            >
                {showValidationErrors && validationErrors.length > 0 && (
                    <Alert
                        severity="error"
                        onClose={() => setShowValidationErrors(false)}
                        className="transition-all duration-300 ease-in-out"
                    >
                        <div>
                            <strong>Por favor, corrije los siguientes errores:</strong>
                            <ul className="mt-2 ml-4">
                                {validationErrors.map((error, index) => (
                                    <li key={index} className="list-disc transition-all duration-200">{error}</li>
                                ))}
                            </ul>
                        </div>
                    </Alert>
                )}
            </div>

            <div className="flex items-center gap-2 bg-tableBg py-4 px-6 rounded-[10px] w-full">
                <h1 className="font-bold text-primary">{useSurveillanceLocales("operation.create.title")} - </h1>
                <FormInputField
                    name="description"
                    register={register}
                    placeholder={useSurveillanceLocales("operation.create.placeholder")}
                    type="text"
                    error={errors.description}
                />
            </div>
            {fields.length > 0 && (
                <>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", padding: "0 16px" }}>
                        <Tabs
                            value={activeTab}
                            onChange={(_, newTab) => setActiveTab(newTab)}
                            aria-label="Question Tabs"
                        >
                            {fields.map((q, idx) => {
                                const hasError = errors.questions && Array.isArray(errors.questions) && errors.questions[idx];
                                return (
                                    <Tab
                                        key={q.id}
                                        label={`Pregunta ${idx + 1}`}
                                        sx={{
                                            color: hasError ? 'red' : 'inherit',
                                            transition: 'color 0.3s ease-in-out'
                                        }}
                                    />
                                );
                            })}
                            <Tab
                                icon="+"
                                aria-label="Añadir pregunta"
                                onClick={() => handleAddQuestion(undefined)}
                            />
                        </Tabs>
                    </Box>

                    {fields[activeTab] && (
                        <Box sx={{ p: 2 }}>
                            {createQuestionEditor(fields[activeTab] as OperationQuestion, {
                                setQuestion: handleSetQuestion,
                                changeQuestionType: handleChangeQuestionType,
                                removeQuestion: handleRemoveQuestion,
                                index: activeTab,
                                path: `questions.${activeTab}`,
                                formMethods
                            })}
                        </Box>
                    )}
                </>
            )}
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