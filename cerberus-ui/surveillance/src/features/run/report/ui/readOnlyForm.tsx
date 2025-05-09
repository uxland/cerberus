import { Typography, Chip } from "@mui/material";
import { InspectionRun } from "../../execution/domain/model.ts";
import { useSurveillanceLocales } from "../../../../locales/ca/locales.ts";
import { FormInputField, Select } from "@cerberus/core";

interface InspectionFormReadOnlyProps {
    inspection: InspectionRun;
}


export const InspectionFormReadOnly = ({ inspection }: InspectionFormReadOnlyProps) => {
    const operationTitle = useSurveillanceLocales('run.set.operationTitle');
    const additionalComments = useSurveillanceLocales('run.set.aditionalComments');
    const isAnomalous = useSurveillanceLocales('run.report.isAnomalous');


    return (
        <div className="flex flex-col bg-tableBg p-4 md:p-6 rounded-[10px] w-full overflow-hidden"
        >
            <div className="flex-shrink-0">
                <Typography className="uppercase !text-grey82 !font-semibold">
                    {operationTitle}: {inspection.operationRun.description}
                </Typography>
                <span className="bg-[#313131] block p-[1px] w-full mb-3"></span>
            </div>
            <div className="flex-grow overflow-auto p-1">
                {inspection?.operationRun.answers.map((answer, index) => {
                    return (
                        <div key={answer.question.id} className="mb-4">
                            <div className="flex items-center justify-between">
                                <Typography className="text-sm font-semibold mb-2">{answer.question.text}</Typography>
                                {answer.answer.values[0]?.isAnomalous && (
                                    <Chip
                                        label={isAnomalous}
                                        className="bg-error text-white font-bold mb-2"
                                        size="small"
                                        variant="filled"
                                        color="error"
                                    />
                                )}
                            </div>
                            {answer.question.__type != "Options" ? (
                                <FormInputField
                                    question={answer.question}
                                    answer={answer.answer}
                                    index={index}
                                    formMethods={null}
                                    disabled
                                    className="bg-[#313131] w-full p-2 rounded"
                                />
                            ) : (
                                <Select
                                    disabled
                                    selected={answer.answer.values[0]?.code || ""}
                                    options={answer.question.options.map(option => ({
                                        value: option.code,
                                        label: option.text
                                    })) || []}
                                />
                            )}
                        </div>
                    );
                })}

                <Typography className="mt-3">{additionalComments}</Typography>

                <textarea
                    className="bg-[#313131] w-full min-h-[80px] p-2 rounded"
                    disabled
                    defaultValue={inspection.operationRun.additionalComments}
                />
            </div>
        </div>
    );
};