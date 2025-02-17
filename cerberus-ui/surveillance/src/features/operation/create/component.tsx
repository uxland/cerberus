import React, { useState } from 'react';
import { InputField, Select } from "@cerberus/core";
import { Button, Typography } from "@mui/material";
import { OperationQuestion } from './command';

type QuestionType = "Opciones" | "Númerico" | "Texto Libre";
type ResponseSubtype = "Única" | "Múltiple";
type Required = "Sí" | "No";

export const SurveillanceOperationEditor = () => {
    const [operationName, setOperationName] = useState("");
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

    const handleSelectType = (option: string) => {
        console.log(`Selected: ${option}`);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
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

    const handleAnswerChange = (questionIndex: number, answerIndex: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers[answerIndex] = value;
        setQuestions(updatedQuestions);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 bg-tableBg py-4 px-6 rounded-[10px] w-full">
                <h1 className="font-bold text-primary">Creación de Operativa - </h1>
                <InputField
                    title=""
                    onChange={handleInputChange}
                    placeholder="Añade el nombre de tu nueva operativa"
                />
            </div>
            {questions.map((question, index) => (
                <div className="flex flex-col gap-2 bg-tableBg py-4 px-6 rounded-[10px] w-full" key={question.id}>
                    <h1 className="font-bold">Pregunta {index + 1}: </h1>
                    <InputField
                        title=""
                        onChange={handleInputChange}
                        placeholder="Añade título a tu pregunta"
                    />
                    <div className="flex gap-4 mt-2">

                        <Select
                            title="Tipología de respuesta"
                            options={['Opciones', 'Númerico', 'Texto Libre']}
                            onSelect={handleSelectType}
                        />
                        <Select
                            title="Subtipología de respuesta"
                            options={['Única', 'Múltiple']}
                            onSelect={handleSelectType}
                        />
                        <Select
                            title="Obligatoriedad"
                            options={['Sí', 'No']}
                            onSelect={handleSelectType}
                        />
                    </div>
                    {question.answers.map((answer, answerIndex) => (
                        <div key={answerIndex}>
                            <h1 className="font-bold mt-2">Respuesta {answerIndex + 1}</h1>
                            <InputField
                                title=""
                                onChange={(e) => handleAnswerChange(index, answerIndex, e.target.value)}
                                placeholder="..."
                                value={answer}
                            />
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
                    type="button"
                    className="text-xs uppercase bg-secondary text-white font-bold py-2 px-8 rounded-full ml-auto hover:bg-secondaryHover">
                    Proceder
                </button>
            </div>
        </div>
    );
}