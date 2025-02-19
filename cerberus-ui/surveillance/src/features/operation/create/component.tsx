import React, { useState } from 'react';
import { InputField, Select } from "@cerberus/core";
import { Button, Typography } from "@mui/material";
import { OperationQuestion } from './command';
import { Mediator } from 'mediatr-ts';
import { CreateOperation } from './command';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { notificationService } from '@cerberus/core';
import { SurveillanceOperationForm } from './ui/component';
type QuestionType = "Opciones" | "Númerico" | "Texto Libre";
type ResponseSubtype = "Única" | "Múltiple";
type Required = "Sí" | "No";

export const SurveillanceOperationEditor = () => {
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState<OperationQuestion[]>([
        {
            id: Math.random(),
            title: "",
            responseType: "Opciones",
            responseSubtype: "Única",
            required: false,
            answers: ["", "", ""],
        },
    ]);

    const handleSubmit = async () => {
        try {
            console.log('description', description, 'questions', questions);
            const operation = await new Mediator().send(new CreateOperation(description, questions));
            notificationService.notifySuccess('successMessage');
        } catch (e) {
            notificationService.notifyError('errorMessage', e.message);
            console.error(e.message);
        }

    };

    const handleSelectType = (questionIndex: number, field: string, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, questionIndex?: number, field?: string, answerIndex?: number) => {
        const { value } = e.target;

        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];

            if (questionIndex !== undefined) {
                if (field === 'title') {
                    updatedQuestions[questionIndex].title = value;
                } else if (answerIndex !== undefined) {
                    updatedQuestions[questionIndex].answers[answerIndex] = value;
                }
            } else {
                setDescription(value);
                return prevQuestions;
            }

            return updatedQuestions;
        });
    };

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Math.random(),
                title: "",
                responseType: "Opciones",
                responseSubtype: "Única",
                required: false,
                answers: [""],
            },
        ]);
    };

    const handleAddAnswer = (questionIndex: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers = [...updatedQuestions[questionIndex].answers, ""];
        setQuestions(updatedQuestions);
    };
    const handleRemoveAnswer = (questionIndex: number, answerIndex: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers.splice(answerIndex, 1);
        setQuestions(updatedQuestions);
    };
    const handleRemoveQuestion = (questionIndex: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(questionIndex, 1);
        setQuestions(updatedQuestions);
    };

    return (
        <div className="space-y-6">
            {/* <div className="flex items-center gap-2 bg-tableBg py-4 px-6 rounded-[10px] w-full">
                <h1 className="font-bold text-primary">Creación de Operativa - </h1>
                <InputField
                    title=""
                    onChange={(e) => handleInputChange(e)}
                    placeholder="Añade el nombre de tu nueva operativa"
                />
            </div>
            {questions.map((question, index) => (
                <div className="flex flex-col gap-2 bg-tableBg py-4 px-6 rounded-[10px] w-full" key={question.id}>
                    <div className="flex gap-4 justify-between items-center">
                        <h1 className="font-bold">Pregunta {index + 1}: </h1>
                        <button onClick={() => handleRemoveQuestion(index)} className='flex bg-red-500 p-1 rounded-full hover:bg-red-300 '><DeleteOutlineIcon /></button>
                    </div>
                    <InputField
                        title=""
                        onChange={(e) => handleInputChange(e, index, 'title')}
                        placeholder="Añade título a tu pregunta"
                    />
                    <div className="flex gap-4 mt-2">

                        <Select
                            title="Tipología de respuesta"
                            options={['Opciones', 'Númerico', 'Texto Libre']}
                            onSelect={(value) => handleSelectType(index, "responseType", value)}
                        />
                        <Select
                            title="Subtipología de respuesta"
                            options={['Única', 'Múltiple']}
                            onSelect={(value) => handleSelectType(index, "responseSubtype", value)}
                        />
                        <Select
                            title="Obligatoriedad"
                            options={['Sí', 'No']}
                            onSelect={(value) => handleSelectType(index, "required", value)}
                        />
                    </div>
                    {question.answers.map((answer, answerIndex) => (
                        <div key={answerIndex}>
                            <h1 className="font-bold mt-2">Respuesta {answerIndex + 1}</h1>
                            <div className="flex gap-4 mt-2 items-center">
                                <InputField
                                    title=""
                                    onChange={(e) => handleInputChange(e, index, 'answer', answerIndex)}
                                    placeholder="..."
                                    value={answer}
                                />
                                <button
                                    type="button"
                                    className="text-xs uppercase bg-formSelect text-black font-bold py-2 px-8 rounded-full hover:bg-formSelectHover"
                                    onClick={() => handleRemoveAnswer(index, answerIndex)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="items-start mt-2">
                        <button
                            type="button"
                            className="text-primary font-bold hover:text-formSelect"
                            onClick={() => handleAddAnswer(index)}
                        >
                            + Añadir respuesta
                        </button>
                    </div>
                </div>
            ))}

            <div className="flex gap-4">
                <button
                    type="button"
                    className="text-xs uppercase bg-formSelect text-black font-bold py-2 px-8 rounded-full hover:bg-formSelectHover"
                    onClick={handleAddQuestion}
                >
                    + Añadir pregunta
                </button>
                <button
                    type="button"
                    className="text-xs uppercase bg-[#313131] text-white font-bold py-2 px-8 rounded-full hover:bg-[#505050]">
                    Previsualizar
                </button>
            </div>
            <div className="flex">
                <button
                    onClick={handleSubmit}
                    type="button"
                    className="text-xs uppercase bg-secondary text-white font-bold py-2 px-8 rounded-full ml-auto hover:bg-secondaryHover">
                    Proceder
                </button>
            </div> */}
            <SurveillanceOperationForm initialModel={{ name: "", questions: [] }} />
        </div>
    );
}