import { Typography } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { ExecutionForm } from "../domain/validation";
import { useState, useEffect } from "react";

interface ActionItemProps {
    action: any;
    formMethods: UseFormReturn<ExecutionForm>;
    basePath: string;
    index: number;
    level?: number;
}

export const ActionItem = ({ action, formMethods, basePath, index, level = 0 }: ActionItemProps) => {
    const { register, watch, setValue } = formMethods;
    const path = `${basePath}.${index}`;
    const executedPath = `${path}.executed`;
    const executed = watch(executedPath);
    const [showAlternatives, setShowAlternatives] = useState(false);

    // Configurar valores iniciales
    useEffect(() => {
        setValue(`${path}.description`, action.description);
        setValue(executedPath, executed ?? null);
    }, [setValue, path, action.description]);

    // Controlar cuando mostrar alternativas
    useEffect(() => {
        if (executed === false && action.alternativeActions?.length) {
            setShowAlternatives(true);
        } else {
            setShowAlternatives(false);
        }
    }, [executed, action.alternativeActions]);

    return (
        <div className={`ml-${level * 4} mt-3 p-3 bg-[#252525] rounded-md`}>
            <div className="flex items-center gap-2 mb-2">
                <input
                    type="checkbox"
                    {...register(executedPath)}
                    className="bg-[#313131] p-2 rounded"
                />
                <Typography>
                    {action.description}
                </Typography>
            </div>

            <div className="ml-6">
                <Typography variant="caption" className="text-gray-400">
                    Comentarios
                </Typography>
                <textarea
                    className="bg-[#313131] w-full min-h-[60px] p-2 rounded mt-1"
                    {...register(`${path}.comments`)}
                />

                {/* Campo oculto para almacenar la descripción */}
                <input
                    type="hidden"
                    {...register(`${path}.description`)}
                    defaultValue={action.description}
                />
            </div>

            {/* Renderizar recursivamente las acciones alternativas si están disponibles y la acción no fue ejecutada */}
            {showAlternatives && action.alternativeActions?.map((alternative: any, altIndex: number) => (
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