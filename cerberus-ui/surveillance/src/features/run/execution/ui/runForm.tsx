import { Typography } from "@mui/material";
import { Select } from "@cerberus/core";
import React, { useState, useEffect } from 'react';
import {
    Run,
    RunStatus,
    InspectionRun,
    IOperationQuestion,
    TextAnswer,
    IntegerAnswer,
    FloatAnswer,
    OptionAnswer,
    OptionAnswerItem,
    OperationRunQuestionAnswer
} from "../domain/model";
import { Inspection } from "./inspection";
import { IOperationAnswer } from "../domain/model";

interface SurveillanceRunFormArgs {
    runEditionData?: Run;
    onSubmitRequested?: (runId: string, inspectionId: string, answers: OperationRunQuestionAnswer[]) => void;
}


const dummyAnswers: OperationRunQuestionAnswer[] = [
    {
        question: { code: "Q1", text: "¿Está limpia el área?", type: "option" },
        answer: {
            values: [
                { code: "Yes", isAnomalous: false },
                { code: "No", isAnomalous: true },
                { code: "N/A", isAnomalous: false }
            ],
            isAnomalous: false
        } as OptionAnswer
    },
    {
        question: { code: "Q2", text: "¿Hay algún peligro?", type: "integer" },
        answer: {
            value: 0,
            isAnomalous: false
        } as IntegerAnswer
    },
    {
        question: { code: "Q3", text: "¿Funciona correctamente el equipo?", type: "text" },
        answer: {
            value: "",
            isAnomalous: false
        } as TextAnswer
    },
    {
        question: { code: "Q4", text: "¿Cuál es la lectura de temperatura?", type: "float" },
        answer: {
            value: 0,
            isAnomalous: false
        } as FloatAnswer
    },
    {
        question: { code: "Q5", text: "Seleccione la condición del equipo:", type: "option" },
        answer: {
            values: [
                { code: "Good", isAnomalous: false },
                { code: "Fair", isAnomalous: false },
                { code: "Poor", isAnomalous: true },
                { code: "Critical", isAnomalous: true }
            ],
            isAnomalous: false
        } as OptionAnswer
    }
];

const createDummyInspections = (runId: string): InspectionRun[] => {
    const inspections: InspectionRun[] = [];
    for (let i = 1; i <= 5; i++) {
        inspections.push({
            id: `inspection-${i}`,
            cameraId: `camera-${i}`,
            cameraStreamingUrl: `http://example.com/camera-${i}`,
            cameraDescription: `Cámara ${i} Descripción`,
            status: RunStatus.Pending,
            operationRun: {
                operationId: `operation-${i}`,
                description: `Operación ${i} Descripción`,
                answers: dummyAnswers,
                additionalComments: `Comentarios para la Operación ${i}`
            },
            executorId: `executor-${i}`
        });
    }
    return inspections;
};

const dummyRun: Run = {
    id: "1",
    roundId: "Round 1",
    rootLocationId: "Barcelona",
    status: RunStatus.Running,
    inspectionRuns: createDummyInspections("1"),
};


export const SurveillanceRunForm = ({ runEditionData, onSubmitRequested }: SurveillanceRunFormArgs) => {
    const [run, setRun] = useState<Run>(dummyRun);
    const [selectedInspection, setSelectedInspection] = useState<InspectionRun | null>(dummyRun.inspectionRuns[0]);

    useEffect(() => {
        if (runEditionData) {
            setRun(runEditionData);
        }
    }, [runEditionData]);

    useEffect(() => {
        console.log(selectedInspection);
    }, [selectedInspection]);

    const handleInspectionSubmit = (inspectionId: string, answers: OperationRunQuestionAnswer[]) => {
        if (onSubmitRequested && run && run.id) {
            onSubmitRequested(run.id, inspectionId, answers);
        }
    };
    return (
        <>
            <div>

                {selectedInspection && (
                    <div className="space-y-6 flex flex-col h-full">
                        <div className="flex items-center gap-2 bg-tableBg py-4 px-6 rounded-[10px] w-full">
                            <Typography className="uppercase !text-primary !font-semibold"> {run.roundId}</Typography>
                            <Typography className="uppercase"> {run.rootLocationId} - </Typography>
                            <Typography className="!text-grey82 !font-semibold"> {selectedInspection.cameraDescription} </Typography>
                        </div>
                        <Inspection
                            inspection={selectedInspection} onSubmit={handleInspectionSubmit}
                        />
                    </div>
                )}

                <div className="flex justify-between gap-4 m-4">
                    {run.inspectionRuns.map((inspection, index) => (
                        <span
                            key={inspection.id}
                            className={`h-[60px] w-[60px] rounded-[10px] flex items-center justify-center text-grey82 cursor-pointer ${selectedInspection?.id === inspection.id ? 'bg-[#313131]' : 'bg-tableBg'}`}
                            onClick={() => setSelectedInspection(inspection)}
                        >
                            {index + 1}
                        </span>
                    ))}
                    <span className="h-[60px] w-[60px] bg-tableBg rounded-[10px] flex items-center justify-center text-grey82"> + 35</span>
                </div>
            </div>
            <div>
                <Typography>Run ID: {run.id}</Typography>
                <Typography>Round ID: {run.roundId}</Typography>
                <Typography>Root Location: {run.rootLocationId}</Typography>
                <Typography>Status: {run.status}</Typography>
            </div>
        </>
    )
}