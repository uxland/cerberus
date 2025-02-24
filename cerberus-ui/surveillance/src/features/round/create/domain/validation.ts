// import { z } from "zod";

// export const roundSchema = z.object({
//     id: z.string().uuid(),
//     rootLocationId: z.string().min(1),
//     description: z.string().optional(),
//     cronExpression: z.string().min(1),
//     estimatedDuration: z.number().optional(),
//     assignedTo: z.string().optional(),
//     inspections: z.array(
//         z.object({
//             id: z.string(),
//             cameraId: z.string(),
//             cameraDescription: z.string(),
//             streamingUrl: z.string().optional(),
//             operationId: z.string(),
//             operationDescription: z.string(),
//             order: z.number(),
//         })
//     ),
// });

// export type Round = z.infer<typeof roundSchema>;