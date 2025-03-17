import {ExecutionStepArgs} from "../model.ts";
import {InspectionRun} from '../domain/model.ts'
import {getCurrentInspection, InspectionRunData} from "./domain/model.ts";
import {getQuestionInput} from "./ui";
import {Typography} from "@mui/material";
import {useSurveillanceLocales} from "../../../../locales/ca/locales.ts";
import {useForm} from "react-hook-form";
import {SetRunInspection} from "./command.ts";
import {createExecutionFormSchema, ExecutionForm} from "./domain/validation.ts";
import {zodResolver} from "@hookform/resolvers/zod";

export interface InspectionRunProps extends ExecutionStepArgs {
    inspection: InspectionRun;
}

export const InspectionRunEditor = ({run, handler}: ExecutionStepArgs) => {
    const inspection = getCurrentInspection(run);
    const dynamicSchema = createExecutionFormSchema(inspection?.operationRun.answers.length || 0);

    const additionalComments = useSurveillanceLocales('run.set.aditionalComments');
    const proceed = useSurveillanceLocales('run.set.proceed');
    const formTitle = useSurveillanceLocales('run.set.formTitle');

    const formMethods = useForm<ExecutionForm>({
        resolver: zodResolver(dynamicSchema), defaultValues: {
            runId: run.id, inspectionId: inspection.id, additionalComments: "",

        },
    });
    const {register, handleSubmit} = formMethods;


    const onSubmitForm = (data: ExecutionForm) => {
        handler(new SetRunInspection(data as InspectionRunData));
        console.log("run", run);
        console.log("data", data);
    };

    return (<div className="space-y-6">
            <div>
                {inspection && (<div className="space-y-6 flex flex-col h-full">
                        <div className="flex items-center gap-2 bg-tableBg py-4 px-6 rounded-[10px] w-full">
                            <Typography className="uppercase !text-primary !font-semibold"> {run.roundId}</Typography>
                            <Typography className="uppercase"> {run.rootLocationId} - </Typography>
                            <Typography
                                className="!text-grey82 !font-semibold"> {inspection.cameraDescription} </Typography>
                        </div>

                    </div>)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                <div
                    className="md:col-span-2 bg-tableBg p-4 md:p-6 rounded-[10px] w-full flex items-center justify-center">
                    <img className="max-h-full object-contain" src={inspection.cameraStreamingUrl} alt=""/>
                </div>
                <form onSubmit={handleSubmit(onSubmitForm, (formErrors) => {
                    console.error("Validation failed:", formErrors);
                })} className="flex flex-col bg-tableBg p-4 md:p-6 rounded-[10px] w-full h-full gap-3">
                    <h1 className="text-lg font-bold mb-2">{formTitle}</h1>
                    <Typography
                        className="uppercase !text-grey82 !font-semibold"> Operativa: {inspection.operationRun.description} </Typography>
                    <span className="bg-[#313131] block p-[1px] w-full"></span>

                    {inspection?.operationRun.answers.map((answer, index) => {
                        const QuestionInput = getQuestionInput(answer);
                        return (<div key={answer.question.id}>

                                <QuestionInput {...answer} formMethods={formMethods} index={index}/>
                            </div>)
                    })}

                    <Typography className="mt-3">{additionalComments}</Typography>
                    <textarea
                        className="bg-[#313131] w-full min-h-[80px] p-2 rounded"
                        {...register("additionalComments")}
                    />
                    <button
                        type="submit"
                        className="flex text-xs uppercase bg-secondary text-white font-bold py-2 px-8 rounded-full ml-auto mt-4 hover:bg-secondaryHover"
                    >
                        {proceed}
                    </button>
                </form>
            </div>

            <div className="flex justify-between gap-4 m-4">
                {run.inspectionRuns.map((i, index) => (<span
                        key={i.inspectionId}
                        className={`h-[60px] w-[60px] rounded-[10px] flex items-center justify-center text-grey82 cursor-pointer ${inspection?.inspectionId === inspection.inspectionId ? 'bg-[#313131]' : 'bg-tableBg'}`}
                        // onClick={() => setSelectedInspection(inspection)}
                    >
                        {index + 1}
                    </span>))}
                <span
                    className="h-[60px] w-[60px] bg-tableBg rounded-[10px] flex items-center justify-center text-grey82"> + 35</span>
            </div>
        </div>)
}