import { ExecutionStepArgs } from "../model.ts";
import { getCurrentCameraClipPath, getCurrentCameraId, InspectionRun } from '../domain/model.ts'
import { getCurrentInspection, InspectionRunData } from "./domain/model.ts";
import { Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { SetRunInspection } from "./command.ts";
import { createExecutionFormSchema, ExecutionForm } from "./domain/validation.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { WebRTCPlayer } from "@cerberus/core/";
import { InspectionForm } from "./ui/inspectionForm.tsx";
import { InspectionNavigation } from "./ui/inspectionNavigation.tsx";
import { useEffect } from "react";

export interface InspectionRunProps extends ExecutionStepArgs {
    inspection: InspectionRun;
}

export const InspectionRunEditor = ({ run, handler }: ExecutionStepArgs) => {
    const inspection = getCurrentInspection(run);
    const dynamicSchema = createExecutionFormSchema(inspection?.operationRun.answers ?? []);

    // Función para inicializar recursivamente las acciones y alternativas
    const initializeActions = (actions: any[]): any[] => {
        if (!actions || !Array.isArray(actions)) return [];

        return actions.map(action => ({
            description: action.description,
            executed: action.executed ?? null,
            comments: action.comments ?? "",
            alternatives: action.alternatives ? initializeActions(action.alternatives) : null
        }));
    };

    // Función para crear los valores por defecto incluyendo las acciones
    const createDefaultValues = (): Partial<ExecutionForm> => {
        const answers = inspection?.operationRun.answers.map((answer) => ({
            questionId: answer.question.id,
            answer: null,
            actions: answer.answer?.actions ? initializeActions(answer.answer.actions) : []
        })) || [];

        return {
            runId: run.id,
            inspectionId: inspection?.id || "",
            additionalComments: "",
            answers,
            startedAt: new Date(),
        };
    };

    const formMethods = useForm<ExecutionForm>({
        resolver: zodResolver(dynamicSchema),
        defaultValues: createDefaultValues(),
    });

    const formValues = formMethods.watch();

    useEffect(() => {
        console.log("Modelo del formulario actualizado:", formValues);
    }, [formValues]);

    const onSubmitForm = (data: ExecutionForm) => {
        handler(new SetRunInspection(data as InspectionRunData));
        console.log("data", data);
    };
    const { formState: { errors } } = formMethods;
    console.log("errors", errors)

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {inspection && (
                <div className="flex items-center gap-2 bg-tableBg py-3 px-6 rounded-[10px] w-full flex-shrink-0">
                    <Typography className="uppercase !text-primary !font-semibold">{run.roundId}</Typography>
                    <Typography className="uppercase">{run.rootLocationId} - </Typography>
                    <Typography className="!text-grey82 !font-semibold">{inspection.cameraDescription}</Typography>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow mt-4 overflow-hidden">
                <div className="md:col-span-2 bg-tableBg p-4 md:p-6 rounded-[10px] flex items-center justify-center overflow-hidden">
                    <WebRTCPlayer cameraId={getCurrentCameraId(run)} clipPath={getCurrentCameraClipPath(run)} />
                </div>

                <InspectionForm
                    inspection={inspection}
                    formMethods={formMethods}
                    onSubmit={onSubmitForm}
                />
            </div>
            <InspectionNavigation
                inspectionRuns={run.inspectionRuns}
                currentInspectionId={inspection?.inspectionId}
            />
        </div>
    );
}