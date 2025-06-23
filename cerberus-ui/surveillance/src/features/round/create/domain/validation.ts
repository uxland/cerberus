import { z } from "zod";
import { cronValidator } from "./cronValidation";

export const roundSchema = z.object({
    id: z.string().uuid(),
    rootLocationId: z.string().min(1),
    description: z.string().nonempty('La descripción de la ronda es obligatoria'),
    cronExpression: cronValidator,
    estimatedDuration: z.number().optional(),
    assignedTo: z.string().optional(),
    deferredExecution: z.object({
        clipDurationInSeconds: z.number().min(1, "La duración del clip debe ser de al menos 1 segundo"),
    }).optional(),
    inspections: z.array(
        z.object({
            id: z.string().uuid(),
            cameraId: z.string().min(1, "El ID de la cámara es obligatorio"),
            cameraDescription: z.string().nonempty("La descripción de la cámara es obligatoria"),
            streamingUrl: z.string().nullable().optional(),
            operationId: z.string().nonempty(),
            operationDescription: z.string().nonempty(),
            order: z.number().min(1, "El orden debe ser al menos 1"),
        })
    ).nonempty("Todas las cámaras deben tener una operación asignada"),
});


export const InspectionSchema = z.object({
    operationId: z.string().nonempty(),
    operationDescription: z.string().nonempty(),
})

export type Round = z.infer<typeof roundSchema>;