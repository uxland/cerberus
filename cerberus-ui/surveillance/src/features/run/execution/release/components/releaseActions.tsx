import { Typography } from "@mui/material";
import { useState } from "react";

interface ReleaseActionsProps {
    runId: string;
    title: string;
    additionalComments: string;
    confirmButtonText: string;
    cancelButtonText: string;
    commentsPlaceholder: string;
    onCancel?: () => void;
    onConfirm?: (comments: string) => void;
}

export const ReleaseActions = ({
    title,
    additionalComments,
    confirmButtonText,
    cancelButtonText,
    commentsPlaceholder,
    onCancel = () => { },
    onConfirm
}: ReleaseActionsProps) => {
    const [comments, setComments] = useState<string>("");



    return (
        <div className="flex flex-col bg-tableBg p-6 rounded-[10px] h-full">
            <div className="flex-shrink-0">
                <h1 className="text-xl font-bold mb-4">{title}</h1>
                <span className="bg-[#313131] block p-[1px] w-full mb-5"></span>
            </div>

            <div className="flex-grow">
                <div className="mb-8 flex flex-col">
                    <Typography className="mb-3">{additionalComments}</Typography>
                    <textarea
                        className="bg-[#313131] w-full min-h-[120px] p-3 rounded"
                        onChange={e => setComments(e.target.value)}
                        value={comments}
                        placeholder={commentsPlaceholder}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-4 flex-shrink-0">
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-xs uppercase bg-[#313131] text-white font-bold py-2 px-8 rounded-full hover:bg-opacity-80"
                >
                    {cancelButtonText}
                </button>
                <button
                    type="button"
                    onClick={() => { onConfirm(comments) }}
                    className="text-xs uppercase bg-secondary text-white font-bold py-2 px-8 rounded-full hover:bg-secondaryHover"
                >
                    {confirmButtonText}
                </button>
            </div>
        </div>
    );
};