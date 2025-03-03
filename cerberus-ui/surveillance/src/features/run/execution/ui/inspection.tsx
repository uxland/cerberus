import { Typography } from "@mui/material";
import { Select } from "@cerberus/core";
import React from 'react';

interface InspectionProps {
    roundName: string;
    locationName: string;
    cameraName: string;
    questions: { code: string; text: string; type: string }[];
}

export const Inspection = ({ roundName, locationName, cameraName, questions }: InspectionProps) => {
    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex items-center gap-2 bg-tableBg py-4 px-6 rounded-[10px] w-full">
                <Typography className="uppercase !text-primary !font-semibold"> {roundName}</Typography>
                <Typography className="uppercase"> {locationName} - </Typography>
                <Typography className="!text-grey82 !font-semibold"> {cameraName} </Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                <div className="md:col-span-2 bg-tableBg p-4 md:p-6 rounded-[10px] w-full flex items-center justify-center">
                    <img className="max-h-full object-contain" src="https://estaticos-cdn.prensaiberica.es/clip/9c2226f5-ce32-4647-a314-71a85bb2eec0_source-aspect-ratio_default_0.jpg" alt="" />
                </div>
                <form className="flex flex-col bg-tableBg p-4 md:p-6 rounded-[10px] w-full h-full gap-3">
                    <h1 className="text-lg font-bold mb-2">Formulario</h1>
                    <Typography className="uppercase !text-grey82 !font-semibold"> Operativa x </Typography>
                    <span className="bg-[#313131] block p-[1px] w-full"></span>
                    <div className="flex-grow flex flex-col justify-between">
                        <div className="space-y-3">
                            {questions.map((question, index) => (
                                <div key={question.code}>
                                    <Typography className="!mt-3"> {`Pregunta ${index + 1}: ${question.text}`} </Typography>
                                    <Select
                                        title=""
                                        options={[
                                            { value: "1", label: "Si" },
                                            { value: "2", label: "No" },
                                            { value: "3", label: "N/A" },
                                        ]}
                                    />
                                </div>
                            ))}
                            <Typography className="mt-3">Comentarios adicionales</Typography>
                            <textarea className="bg-[#313131] w-full min-h-[80px] p-2 rounded" name="" id=""></textarea>
                        </div>
                        <button
                            type="submit"
                            className="flex text-xs uppercase bg-secondary text-white font-bold py-2 px-8 rounded-full ml-auto mt-4 hover:bg-secondaryHover">
                            Proceder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};