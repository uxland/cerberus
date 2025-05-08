import { ExecutionStepArgs } from "../model.ts";
import { InspectionRun, getCurrentCameraId } from '../domain/model.ts'
import { getCurrentInspection, InspectionRunData } from "./domain/model.ts";
import { getQuestionInput } from "./ui";
import { Typography } from "@mui/material";
import { useSurveillanceLocales } from "../../../../locales/ca/locales.ts";
import { useForm } from "react-hook-form";
import { SetRunInspection } from "./command.ts";
import { createExecutionFormSchema, ExecutionForm } from "./domain/validation.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {WebRTCPlayer} from "@cerberus/core/";
//import WebRTCPlayer from "./ui/WebRTCPlayer.tsx";

export interface InspectionRunProps extends ExecutionStepArgs {
    inspection: InspectionRun;
}

export const InspectionRunEditor = ({ run, handler }: ExecutionStepArgs) => {
    const inspection = getCurrentInspection(run);
    const dynamicSchema = createExecutionFormSchema(inspection?.operationRun.answers ?? []);

    const additionalComments = useSurveillanceLocales('run.set.aditionalComments');
    const proceed = useSurveillanceLocales('run.set.proceed');
    const formTitle = useSurveillanceLocales('run.set.formTitle');

    const formMethods = useForm<ExecutionForm>({
        resolver: zodResolver(dynamicSchema), defaultValues: {
            runId: run.id,
            inspectionId: inspection.id,
            additionalComments: "",
            startedAt: new Date(),
        },
    });
    const { register, handleSubmit } = formMethods;

    const onSubmitForm = (data: ExecutionForm) => {
        handler(new SetRunInspection(data as InspectionRunData));
        console.log("run", run);
        console.log("data", data);
        console.log("inspection", inspection);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
            {inspection && (
                <div className="flex items-center gap-2 bg-tableBg py-3 px-6 rounded-[10px] w-full flex-shrink-0">
                    <Typography className="uppercase !text-primary !font-semibold">{run.roundId}</Typography>
                    <Typography className="uppercase">{run.rootLocationId} - </Typography>
                    <Typography className="!text-grey82 !font-semibold">{inspection.cameraDescription}</Typography>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow mt-4 overflow-hidden">
                <div className="md:col-span-2 bg-tableBg p-4 md:p-6 rounded-[10px] flex items-center justify-center overflow-hidden">
                    <WebRTCPlayer cameraId={getCurrentCameraId(run)}/>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmitForm)}
                    className="flex flex-col bg-tableBg p-4 md:p-6 rounded-[10px] w-full overflow-hidden"
                >
                    <div className="flex-shrink-0">
                        <h1 className="text-lg font-bold mb-2">{formTitle}</h1>
                        <Typography className="uppercase !text-grey82 !font-semibold">
                            Operativa: {inspection.operationRun.description}
                        </Typography>
                        <span className="bg-[#313131] block p-[1px] w-full mb-3"></span>
                    </div>

                    <div className="flex-grow overflow-auto p-1">
                        {inspection?.operationRun.answers.map((answer, index) => {
                            const QuestionInput = getQuestionInput(answer, formMethods, index);
                            return (
                                <div key={answer.question.id} className="mb-4">
                                    <QuestionInput {...answer} formMethods={formMethods} index={index} />
                                </div>
                            )
                        })}

                        <Typography className="mt-3">{additionalComments}</Typography>
                        <textarea
                            className="bg-[#313131] w-full min-h-[80px] p-2 rounded"
                            {...register("additionalComments")}
                        />
                    </div>

                    <button
                        type="submit"
                        className="flex text-xs uppercase bg-secondary text-white font-bold py-2 px-8 rounded-full ml-auto mt-4 flex-shrink-0 hover:bg-secondaryHover"
                    >
                        {proceed}
                    </button>
                </form>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 px-2 flex-shrink-0">
                {run.inspectionRuns.map((i, index) => (
                    <span
                        key={i.inspectionId}
                        className={`h-[50px] w-[50px] rounded-[10px] flex items-center justify-center text-grey82 cursor-pointer ${inspection?.inspectionId === i.inspectionId ? 'bg-[#313131]' : 'bg-tableBg'}`}
                    >
                        {index + 1}
                    </span>
                ))}
                <span className="h-[50px] w-[50px] bg-tableBg rounded-[10px] flex items-center justify-center text-grey82">
                    + 35
                </span>
            </div>
        </div>
    );
}