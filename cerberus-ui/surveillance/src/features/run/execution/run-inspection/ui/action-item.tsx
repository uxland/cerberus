import { Typography, IconButton, Tooltip } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { Action } from "../domain/model";
import SmsIcon from '@mui/icons-material/Sms';
import { useSurveillanceLocales } from "../../../../../locales/ca/locales.ts";
interface ActionItemProps {
    action: Action;
    formMethods: UseFormReturn<any>;
    basePath: string;
    index: number;
    level?: number;
}

export const ActionItem = ({ action, formMethods, basePath, index, level = 0 }: ActionItemProps) => {
    const { register, watch, setValue, getValues } = formMethods;
    const path = `${basePath}[${index}]`;
    const executedPath = `${path}.executed`;
    const commentsPath = `${path}.comments`;

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const executedValue = watch(executedPath);
    const [showAlternatives, setShowAlternatives] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const addCommentsLanbel = useSurveillanceLocales('run.set.optionQuestion.comments.add');
    const hideCommentsLabel = useSurveillanceLocales('run.set.optionQuestion.comments.hide');
    const saveCommentsLabel = useSurveillanceLocales('run.set.optionQuestion.comments.save');
    const commentsPlaceholderLabel = useSurveillanceLocales('run.set.optionQuestion.comments.placeholder');

    useEffect(() => {
        if (getValues(executedPath) === undefined && action.executed !== undefined) {
            setValue(executedPath, action.executed, { shouldDirty: false, shouldValidate: false });
        }
        setValue(`${path}.description`, action.description, { shouldDirty: false });
    }, [setValue, path, action.description, action.executed, executedPath, getValues]);

    useEffect(() => {
        if (executedValue === false && action.alternatives && action.alternatives.length > 0) {
            setShowAlternatives(true);
        } else {
            setShowAlternatives(false);
        }
    }, [executedValue, action.alternatives]);

    const handleExecution = (value: boolean | null) => {
        setValue(executedPath, value, { shouldDirty: true, shouldValidate: true });
        if (value !== false) {
            setShowAlternatives(false);
        }
    };

    const isRootLevel = level === 0;
    const indentClass = `ml-${level * 6}`;

    return (
        <div className={`relative ${indentClass} ${isRootLevel ? 'mt-3' : 'mt-2'}`}>
            {level > 0 && (
                <div
                    className="absolute left-[-18px] top-0 bottom-0 w-px bg-gray-600"
                    style={{ height: 'calc(100% + 8px)', transform: 'translateX(50%)' }}
                ></div>
            )}

            <div className={`p-4 ${showComments ? 'pb-2' : ''} bg-[#333232] rounded-lg shadow`}>
                <div className="flex items-start flex-col">
                    <Typography variant="body1" className="text-gray-200 flex-grow">
                        {level > 0 && '- '}{action.description}
                    </Typography>
                    <div className="flex items-center gap-2">
                        <span
                            className={`flex text-xs text-white uppercase bg-[#E24E59] text-black font-bold p-1 rounded-md mt-4 flex-shrink-0 hover:bg-[#C93F49] cursor-pointer ${executedValue ? 'opacity-50' : ''}`}
                            onClick={() => handleExecution(false)}
                        >
                            <CloseIcon />
                        </span>
                        <span
                            className={`flex text-xs text-white uppercase bg-[#81CC54] text-black font-bold p-1 rounded-md mt-4 flex-shrink-0 hover:bg-[#6EAA47] cursor-pointer ${executedValue ? '' : 'opacity-50'}`}
                            onClick={() => handleExecution(true)}
                        >
                            <DoneIcon />
                        </span>

                        <div className="h-8 w-[2px] bg-gray-600 mx-1 mt-4"></div>

                        <Tooltip title={showComments ? hideCommentsLabel : addCommentsLanbel}>
                            <span
                                onClick={() => setShowComments(!showComments)}
                                className={`relative flex text-xs text-primary uppercase bg-[#40444C] border border-[#5E6569] -text-black font-bold p-1 rounded-md mt-4 flex-shrink-0 hover:bg-[#535A63] cursor-pointer ${showComments || getValues(commentsPath) ? '' : ''}`}
                            >
                                <SmsIcon />
                                {getValues(commentsPath) && !showComments && (
                                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#81CC53] rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                                )}
                            </span>
                        </Tooltip>
                    </div>
                </div>

                <input type="hidden" {...register(executedPath)} />
                <input type="hidden" {...register(`${path}.description`)} defaultValue={action.description} />

                {showComments && (
                    <div className="mt-3">
                        <textarea
                            ref={textareaRef}
                            className="bg-[#2C2C2C] w-full min-h-[60px] p-2 rounded mt-1 text-gray-300 text-sm focus:ring-1 focus:ring-gray-500 focus:outline-none"
                            placeholder={commentsPlaceholderLabel}
                            {...register(commentsPath)}
                            autoFocus
                            onBlur={() => setShowComments(false)}
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                type="button"
                                className="bg-[#40444C] text-white px-3 py-1 rounded text-sm hover:bg-[#535A63] transition-colors"
                                onClick={() => setShowComments(false)}
                            >
                                {saveCommentsLabel}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showAlternatives && action.alternatives?.map((alternative: Action, altIndex: number) => (
                <ActionItem
                    key={`${path}-alt-${altIndex}`}
                    action={alternative}
                    formMethods={formMethods}
                    basePath={`${path}.alternativeActions`}
                    index={altIndex}
                    level={level + 1}
                />
            ))}
        </div>
    );
};