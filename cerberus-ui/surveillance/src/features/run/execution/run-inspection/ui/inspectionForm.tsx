import { Typography } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { ExecutionForm } from "../domain/validation.ts";
import { InspectionRun } from '../../domain/model.ts';
import { getQuestionInput } from "../ui";
import { useSurveillanceLocales } from "../../../../../locales/ca/locales.ts";
import { useEffect } from "react";
interface InspectionFormProps {
    inspection: InspectionRun;
    formMethods: UseFormReturn<ExecutionForm>;
    onSubmit: (data: ExecutionForm) => void;
}

export const InspectionForm = ({ inspection, formMethods, onSubmit }: InspectionFormProps) => {
    const { register, handleSubmit } = formMethods;
    const additionalComments = useSurveillanceLocales('run.set.aditionalComments');
    const proceed = useSurveillanceLocales('run.set.proceed');
    const formTitle = useSurveillanceLocales('run.set.formTitle');
    const operationTitle = useSurveillanceLocales('run.set.operationTitle');

    useEffect(() => {
        console.log(inspection);
    }, [inspection, formMethods]);
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col bg-tableBg p-4 md:p-6 rounded-[10px] w-full overflow-hidden"
        >
            <div className="flex-shrink-0">
                <h1 className="text-lg font-bold mb-2">{formTitle}</h1>
                <Typography className="uppercase !text-grey82 !font-semibold">
                    {operationTitle}: {inspection.operationRun.description}
                </Typography>
                <span className="bg-[#313131] block p-[1px] w-full mb-3"></span>
            </div>

            <div className="flex-grow overflow-auto p-1">
                {inspection?.operationRun.answers.map((answer, index) => {
                    const QuestionInput = getQuestionInput(answer, formMethods, index);
                    return (
                        <div key={answer.question.id} className="mb-4">
                            <QuestionInput {...answer} formMethods={formMethods} index={index} />
                            { }
                        </div>
                    );
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
    );
};