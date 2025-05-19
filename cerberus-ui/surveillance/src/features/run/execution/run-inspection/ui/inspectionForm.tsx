import { Typography } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { ExecutionForm } from "../domain/validation.ts";
import { InspectionRun } from '../../domain/model.ts';
import { getQuestionInput } from "../ui";
import { useSurveillanceLocales } from "../../../../../locales/ca/locales.ts";
import { useEffect, useState } from "react";
interface InspectionFormProps {
    inspection: InspectionRun;
    formMethods: UseFormReturn<ExecutionForm>;
    onSubmit: (data: ExecutionForm) => void;
}

export const InspectionForm = ({ inspection, formMethods, onSubmit }: InspectionFormProps) => {
    const { register, handleSubmit, trigger } = formMethods;
    const additionalComments = useSurveillanceLocales('run.set.aditionalComments');
    const previusLabel = useSurveillanceLocales('run.set.previus');
    const nextLabel = useSurveillanceLocales('run.set.next');
    const proceed = useSurveillanceLocales('run.set.proceed');
    const formTitle = useSurveillanceLocales('run.set.formTitle');
    const operationTitle = useSurveillanceLocales('run.set.operationTitle');
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const handleNextQuestion = async () => {
        const isValid = await trigger(`answers.${currentQuestion}`);

        if (isValid) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    useEffect(() => {
        console.log(inspection);
    }, [inspection, formMethods]);
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col bg-tableBg p-4 md:p-6 rounded-[10px] w-full overflow-hidden"
        >
            <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-lg font-bold">{formTitle}</h1>
                    <span>
                        {currentQuestion + 1} / {inspection.operationRun.answers.length}
                    </span>
                </div>
                <Typography className="uppercase !text-grey82 !font-semibold">
                    {operationTitle}: {inspection.operationRun.description}
                </Typography>
                <span className="bg-[#313131] block p-[1px] w-full mb-3"></span>
            </div>

            <div className="flex-grow overflow-auto p-1">
                {inspection?.operationRun.answers[currentQuestion] && (() => {
                    const answer = inspection.operationRun.answers[currentQuestion];
                    const QuestionInput = getQuestionInput(answer, formMethods, currentQuestion);
                    return (
                        <div key={answer.question.id} className="mb-4">
                            <QuestionInput {...answer} formMethods={formMethods} index={currentQuestion} />
                            { }
                        </div>
                    );
                })()}
                {currentQuestion + 1 == inspection.operationRun.answers.length && (
                    <>
                        <Typography className="mt-3">{additionalComments}</Typography>
                        <textarea
                            className="bg-[#313131] w-full min-h-[80px] p-2 rounded"
                            {...register("additionalComments")}
                        />
                    </>

                )}
            </div>
            <div className="flex items-center justify-between">

                {currentQuestion > 0 && (
                    <span
                        className="flex text-xs uppercase bg-formSelect text-black font-bold py-2 px-8 rounded-full mt-4 flex-shrink-0 hover:bg-formSelectHover cursor-pointer"
                        onClick={() => setCurrentQuestion(currentQuestion - 1)}
                    >
                        {previusLabel}
                    </span>
                )}

                {currentQuestion + 1 < inspection.operationRun.answers.length ? (
                    <span
                        className="flex text-xs uppercase bg-formSelect text-black font-bold py-2 px-8 rounded-full ml-auto mt-4 flex-shrink-0 hover:bg-formSelectHover cursor-pointer"
                        onClick={handleNextQuestion}
                    >
                        {nextLabel}
                    </span>
                ) : (
                    <button
                        type="submit"
                        className="flex text-xs uppercase bg-secondary text-white font-bold py-2 px-8 rounded-full mt-4 flex-shrink-0 hover:bg-secondaryHover"
                    >
                        {proceed}
                    </button>
                )}
            </div>

        </form>
    );
};