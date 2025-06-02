import { Typography } from "@mui/material";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import SmsIcon from '@mui/icons-material/Sms';

interface ReadOnlyAction {
    action: {
        description: string;
        alternatives?: any[];
    };
    executed: boolean | null;
    comments: string;
    alternatives?: ReadOnlyAction[];
}

interface ReadOnlyActionItemProps {
    action: ReadOnlyAction;
    level?: number;
}

export const ReadOnlyActionItem = ({ action, level = 0 }: ReadOnlyActionItemProps) => {
    const [showComments, setShowComments] = useState(false);
    const isRootLevel = level === 0;
    const indentClass = `ml-${level * 6}`;

    return (
        <div className={`relative ${indentClass} ${isRootLevel ? 'mt-3' : 'mt-2'}`}>
            {level > 0 && (
                <div className="absolute h-20 w-[3px] bg-[#696969] mx-1 mt-4 rounded-xl"></div>
            )}

            <div
                className={`p-4 ${showComments ? 'pb-2' : ''} bg-[#333232] rounded-lg`}
                style={isRootLevel ? { opacity: 0.75 } : {}}
            >
                <div className="flex items-start flex-col">
                    <Typography variant="body1" className="text-gray-200 flex-grow">
                        {level > 0 && '- '}{action.action.description}
                    </Typography>
                    <div className="flex items-center gap-2">
                        <span
                            className={`flex text-xs text-white uppercase bg-[#E24E59] text-black font-bold p-1 rounded-md mt-4 flex-shrink-0 ${action.executed === false ? '' : 'opacity-50'}`}
                        >
                            <CloseIcon />
                        </span>
                        <span
                            className={`flex text-xs text-white uppercase bg-[#81CC54] text-black font-bold p-1 rounded-md mt-4 flex-shrink-0 ${action.executed === true ? '' : 'opacity-50'}`}
                        >
                            <DoneIcon />
                        </span>

                        <div className="h-8 w-[2px] bg-gray-600 mx-1 mt-4"></div>

                        <span
                            onClick={() => setShowComments(!showComments)}
                            className={`relative flex text-xs text-primary uppercase bg-[#40444C] border border-[#5E6569] font-bold p-1 rounded-md mt-4 flex-shrink-0 cursor-pointer ${action.comments ? '' : ''}`}
                        >
                            <SmsIcon />
                            {action.comments && !showComments && (
                                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#81CC53] rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                            )}
                        </span>
                    </div>
                </div>

                {showComments && action.comments && (
                    <div className="mt-3">
                        <div className="bg-[#2C2C2C] w-full min-h-[60px] p-2 rounded mt-1 text-gray-300 text-sm">
                            {action.comments}
                        </div>
                    </div>
                )}

                {/* Renderizar alternatives dentro del mismo contenedor como en ActionItem */}
                {action.alternatives?.map((alternative: ReadOnlyAction, altIndex: number) => (
                    <ReadOnlyActionItem
                        key={`alt-${altIndex}`}
                        action={alternative}
                        level={level + 1}
                    />
                ))}
            </div>
        </div>
    );
};