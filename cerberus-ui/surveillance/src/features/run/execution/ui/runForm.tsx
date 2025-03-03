import { Typography } from "@mui/material";
import { Select } from "@cerberus/core";
import React, { useState, useEffect } from 'react';
import { Run, RunStatus, InspectionRun, IOperationQuestion } from "../domain/model";
import { Inspection } from "./inspection";

interface SurveillanceRunFormArgs {
    runEditionData?: Run;
}

const dummyQuestions: IOperationQuestion[] = [
    { code: "Q1", text: "Is the area clean?", type: "option" },
    { code: "Q2", text: "Are there any hazards?", type: "option" },
    { code: "Q3", text: "Is equipment functioning correctly?", type: "option" },
];

const createDummyInspections = (runId: string): InspectionRun[] => {
    const inspections: InspectionRun[] = [];
    for (let i = 1; i <= 5; i++) {
        inspections.push({
            id: `inspection-${runId}-${i}`,
            inspectionId: `inspection-${i}`,
            cameraId: `camera-${i}`,
            cameraStreamingUrl: `http://example.com/camera-${i}`,
            cameraDescription: `Camera ${i} Description`,
            status: RunStatus.Pending,
            operationRun: {
                operationId: `operation-${i}`,
                description: `Operation ${i} Description`,
                answers: dummyQuestions.map(question => ({ question: question })),
                additionalComments: `Comments for Operation ${i}`
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

export const SurveillanceRunForm = ({ runEditionData, onSubmitRequested }) => {
    const [run, setRun] = useState<Run>(dummyRun);
    const [selectedInspection, setSelectedInspection] = useState<InspectionRun | null>(null);

    useEffect(() => {

    }, [runEditionData]);
    useEffect(() => {
        console.log(selectedInspection);
    }, [selectedInspection]);
    return (
        <>
            <div>
                {selectedInspection && (
                    <Inspection
                        roundName={run.roundId}
                        locationName={run.rootLocationId}
                        cameraName={selectedInspection.cameraDescription}
                        questions={dummyQuestions} // Pass the questions
                    />
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
            {
                <div>
                    <Typography>Run ID: {run.id}</Typography>
                    <Typography>Round ID: {run.roundId}</Typography>
                    <Typography>Root Location: {run.rootLocationId}</Typography>
                    <Typography>Status: {run.status}</Typography>
                </div>
            }
        </>
    )
}