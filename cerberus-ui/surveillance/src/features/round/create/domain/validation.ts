import { z } from "zod";

export const roundSchema = z.object({
    id: z.string().uuid(),
    rootLocationId: z.string().min(1),
    description: z.string().nonempty('round description is required'),
    cronExpression: z.string().refine((value) => value !== '* * * * *', {
        message: 'cron expression is required',
    }),
    estimatedDuration: z.number().optional(),
    assignedTo: z.string().optional(),
    inspections: z.array(
        z.object({
            id: z.string().uuid(),
            cameraId: z.string().min(1, "Camera ID is required"),
            cameraDescription: z.string().nonempty("Camera description is required"),
            streamingUrl: z.string().optional(),
            operationId: z.string().nonempty(),
            operationDescription: z.string().nonempty(),
            order: z.number().min(1, "Order must be at least 1"),
        })
    ).min(1, 'At least one operation assigned to a camera is required'),
});


export const InspectionSchema = z.object({
    operationId: z.string().nonempty(),
    operationDescription: z.string().nonempty(),
})

export type Round = z.infer<typeof roundSchema>;