import { Typography } from "@mui/material";
import { Select } from "@cerberus/core";
import React from 'react';
import { OptionAnswer, TextAnswer, IntegerAnswer, FloatAnswer } from "../domain/model";
import { useForm } from "react-hook-form";
import { InspectionRun, OperationRunQuestionAnswer } from "../domain/model";
import { FormInputField } from "@cerberus/core";
import { useSurveillanceLocales } from "../../../../locales/ca/locales";

interface InspectionProps {
    inspection: InspectionRun;
    onSubmit?: (inspectionId: string, answers: OperationRunQuestionAnswer[]) => void;
}

export const Inspection = ({ inspection, onSubmit }: InspectionProps) => {
    const formTitle = useSurveillanceLocales('run.set.formTitle');
    const additionalComments = useSurveillanceLocales('run.set.aditionalComments');
    const proceed = useSurveillanceLocales('run.set.proceed');
    const formMethods = useForm<InspectionRun>({
        defaultValues: {
            id: inspection.id,
            cameraId: inspection.cameraId,
            cameraStreamingUrl: inspection.cameraStreamingUrl,
            cameraDescription: inspection.cameraDescription,
            status: inspection.status || "Pending",
            operationRun: {
                operationId: inspection.operationRun.operationId,
                description: inspection.operationRun.description,
                answers: [],
                additionalComments: "",
            },
            executorId: inspection.executorId || "",
        },
    });

    const { register, handleSubmit, setValue, watch } = formMethods;

    const onSubmitForm = (data: InspectionRun) => {
        console.log("data", data)
        if (onSubmit) {
            onSubmit(data.id, data.operationRun.answers);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
            <div className="md:col-span-2 bg-tableBg p-4 md:p-6 rounded-[10px] w-full flex items-center justify-center">
                <img className="max-h-full object-contain" src="https://estaticos-cdn.prensaiberica.es/clip/9c2226f5-ce32-4647-a314-71a85bb2eec0_source-aspect-ratio_default_0.jpg" alt="" />
            </div>
            <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col bg-tableBg p-4 md:p-6 rounded-[10px] w-full h-full gap-3">
                <h1 className="text-lg font-bold mb-2">{formTitle}</h1>
                <Typography className="uppercase !text-grey82 !font-semibold"> Operativa: {inspection.operationRun.description} </Typography>
                <span className="bg-[#313131] block p-[1px] w-full"></span>
                <div className="flex-grow flex flex-col justify-between">
                    <div className="space-y-3">
                        {inspection.operationRun.answers.map((item, index) => (
                            <div key={item.question.code}>
                                <Typography className="!mt-3"> {item.question.text}</Typography>

                                {item.question.type === "option" && (
                                    <Select<InspectionRun>
                                        name={`answer.value`}
                                        path={`operationRun.answers.${index}`}
                                        title=""
                                        options={(item.answer as OptionAnswer)?.values.map(option => ({
                                            value: option.code,
                                            label: option.code
                                        })) || []}
                                        formMethods={formMethods}

                                    />
                                )}

                                {item.question.type === "text" && (
                                    <FormInputField
                                        type="text"
                                        className="bg-[#313131] w-full p-2 rounded"
                                        defaultValue={(item.answer as TextAnswer)?.value || ""}
                                        register={register}
                                        name={`operationRun.answers.${index}.answer.value`}
                                    />
                                )}

                                {item.question.type === "integer" && (
                                    <FormInputField
                                        type="number"
                                        step="1"
                                        className="bg-[#313131] w-full p-2 rounded"
                                        defaultValue={(item.answer as IntegerAnswer)?.value || 0}
                                        register={register}
                                        name={`operationRun.answers.${index}.answer.value`}
                                    />
                                )}

                                {item.question.type === "float" && (
                                    <FormInputField
                                        type="number"
                                        step="0.1"
                                        className="bg-[#313131] w-full p-2 rounded"
                                        defaultValue={(item.answer as FloatAnswer)?.value || 0}
                                        register={register}
                                        name={`operationRun.answers.${index}.answer.value`}
                                    />
                                )}
                            </div>
                        ))}
                        <Typography className="mt-3">{additionalComments}</Typography>
                        <textarea
                            className="bg-[#313131] w-full min-h-[80px] p-2 rounded"
                            {...register("operationRun.additionalComments")}
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex text-xs uppercase bg-secondary text-white font-bold py-2 px-8 rounded-full ml-auto mt-4 hover:bg-secondaryHover"
                    >
                        {proceed}
                    </button>
                </div>
            </form>
        </div>
    );
};