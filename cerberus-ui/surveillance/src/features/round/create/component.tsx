import React, { useState } from 'react';
import { Typography } from '@mui/material';
export const SurveillanceRoundsEditor = () => {


    return (
        <div className="mb-96 space-y-6">
            <div className="flex flex-col gap-2 bg-tableBg py-4 px-6 rounded-[10px] w-full">
                <h1 className="font-bold text-primary">Creación de Ronda</h1>

            </div>
            <div className="flex gap-4">
                <button className="bg-primary py-3 px-5 rounded-md text-black font-bold text-xl hover:bg-formSelect">+</button>
                <button className="bg-[#313131] py-3 px-5 rounded-md text-white font-bold text-xl hover:bg-[#505050]">+</button>
                <div className="flex flex-col justify-center bg-tableBg px-4 rounded-md gap-2">
                    <Typography className="!text-xs !font-semibold"> 10 cámaras</Typography>
                    <Typography className="!text-xs !font-semibold">Diario - 10:00 p.m.</Typography>
                </div>
                <div className="flex flex-col justify-center bg-tableBg px-4 rounded-md gap-2">
                    <Typography className="!text-xs !font-semibold">Grupo Asignado: Grupo 1</Typography>
                    <Typography className="!text-xs !font-semibold">Duración aproximada de la ronda: 20 mins.</Typography>
                </div>
                <div className="flex gap-4 items-center ml-auto">
                    <button className="text-xs uppercase bg-[#313131] text-white font-bold py-2 px-4 rounded-full hover:bg-[#505050] flex items-center justify-center">
                        Asignar operativa
                    </button>
                    <button className="text-xs uppercase bg-secondary text-white font-bold py-2 px-4 rounded-full ml-auto hover:bg-secondaryHover">
                        Proceder
                    </button>
                </div>

            </div>

            <div className="grid grid-cols-5 gap-6">
                <div className="space-y-2">
                    <img className="rounded-md border border-[3px] border-primary" src="https://estaticos-cdn.prensaiberica.es/clip/9c2226f5-ce32-4647-a314-71a85bb2eec0_source-aspect-ratio_default_0.jpg" alt="" />
                    <Typography className="text-center !text-xs px-2">Cam 1 - Operativa 1 Grup 1 Area 2</Typography>
                </div>
                <div className="space-y-2">
                    <img className="rounded-md " src="https://estaticos-cdn.prensaiberica.es/clip/9c2226f5-ce32-4647-a314-71a85bb2eec0_source-aspect-ratio_default_0.jpg" alt="" />
                    <Typography className="text-center !text-xs px-2">Cam 1 - Operativa 1 Grup 1 Area 2</Typography>
                </div>
            </div>
        </div>
    );
}