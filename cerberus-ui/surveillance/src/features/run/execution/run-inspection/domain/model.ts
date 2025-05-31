import { Run, InspectionRun } from "../../domain/model.ts";
import { OperationAction, OperationQuestion } from "../../../../operation/create/domain";
import {
    ValueEqualsSpec,
    ValueGreaterThanSpec,
    ValueLowerThanSpec,
    ValueGreaterThanOrEqualSpec,
    ValueLowerThanOrEqualSpec
} from "../../../../operation/create/domain/action-specs.ts";


export interface OperationAnswer {
    questionId: string | string[];
    answer: any;
    actions: Action[] | null;
}
export interface InspectionRunData {
    runId: string;
    inspectionId: string;
    additionalComments: string | undefined;
    answers: OperationAnswer[];
    startedAt: Date | undefined;
}

export interface Action {
    description: string;
    executed: boolean | null;
    comments: string;
    alternatives: Action[] | null;
}

export const getCurrentInspection: (run: Run) => InspectionRun | undefined = (run) => run.inspectionRuns.find(ir => ir.inspectionId === run.currentInspectionRunId);

export const getRequiredActions: (question: OperationQuestion, values: any[]) => OperationAction[] = (question, values) => {
    const triggers = question.triggers || [];

    const matchedTriggers = triggers.filter(trigger => {
        const condition = ensureSpecObject(trigger.condition);
        return values.some(v => condition.isSatisfiedBy(v));
    });

    const allActions: OperationAction[] = [];
    matchedTriggers.forEach(trigger => {
        allActions.push(...trigger.actions);
    });

    return allActions;
}

// Helper function to recreate Spec objects with proper methods
function ensureSpecObject(condition: any): any {
    if (!condition) return { isSatisfiedBy: () => false };

    // If it already has the method, use it
    if (typeof condition.isSatisfiedBy === 'function') {
        return condition;
    }

    // Otherwise recreate the proper Spec object based on type
    if (condition.__type) {
        switch (condition.__type) {
            case "Equals":
                return new ValueEqualsSpec(condition.value);
            case "GreaterThan":
                return new ValueGreaterThanSpec(condition.value);
            case "LowerThan":
                return new ValueLowerThanSpec(condition.value);
            case "GreaterThanOrEqual":
                return new ValueGreaterThanOrEqualSpec(condition.value);
            case "LowerThanOrEqual":
                return new ValueLowerThanOrEqualSpec(condition.value);
            default:
                console.warn("Unknown spec type:", condition.__type);
                return { isSatisfiedBy: () => false };
        }
    }

    // Fallback
    console.warn("Invalid condition object:", condition);
    return { isSatisfiedBy: () => false };
}