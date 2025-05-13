import { OperationQuestion, AnomalousSettings } from "./model.ts";

export interface Option {
    code: string;
    text: string;
    anomalousSettings: AnomalousSettings | undefined;
}

export type OptionsTypology = "Single" | "Multiple";

export interface OptionsQuestion extends OperationQuestion {
    __type: "Options";
    options: Option[];
    type: OptionsTypology;
}

const createOptionId = (question: OptionsQuestion): string => {
    const maxId = question.options
        .map(option => Number.parseInt(option.code, 10))
        .filter(code => !Number.isNaN(code))
        .reduce((max, code) => Math.max(max, code), 0);
    return (maxId + 1).toString();
};

export const appendOption = (question: OptionsQuestion, code: string | undefined) => {
    const option = <Option>{
        code: code || createOptionId(question),
        text: "",
        anomalousSettings: undefined
    }
    return { ...question, options: [...question.options, option] };
}

export const setOptionText = (question: OptionsQuestion, optionCode: string, text: string): OptionsQuestion => {
    return { ...question, options: question.options.map(o => o.code === optionCode ? { ...o, text } : o) };
}

export const setOptionCode = (question: OptionsQuestion, optionCode: string, code: string): OptionsQuestion => {
    return { ...question, options: question.options.map(o => o.code === optionCode ? { ...o, code } : o) };
}

export const setTypology = (question: OptionsQuestion, type: OptionsTypology): OptionsQuestion => {
    return { ...question, type };
}

export const removeOption = (question: OptionsQuestion, optionCode: string): OptionsQuestion => {
    return { ...question, options: question.options.filter(o => o.code !== optionCode) };
}

export const setOptionAnomalousSettings = (question: OptionsQuestion, optionCode: string, anomalousSettings: AnomalousSettings | undefined): OptionsQuestion => {
    return { 
        ...question, 
        options: question.options.map(o => o.code === optionCode ? { ...o, anomalousSettings } : o) 
    };
}

export const appendActionToOption = (question: OptionsQuestion, optionCode: string): OptionsQuestion => {
    return {
        ...question,
        options: question.options.map(opt => {
            if (opt.code === optionCode) {
                const currentSettings = opt.anomalousSettings || { actions: [] };
                const newAction = {
                    description: "",
                    alternatives: undefined
                };
                return {
                    ...opt,
                    anomalousSettings: {
                        ...currentSettings,
                        actions: [...currentSettings.actions, newAction]
                    }
                };
            }
            return opt;
        })
    };
};

export const removeActionFromOption = (question: OptionsQuestion, optionCode: string, actionIndex: number): OptionsQuestion => {
    return {
        ...question,
        options: question.options.map(opt => {
            if (opt.code === optionCode && opt.anomalousSettings) {
                const updatedActions = [...opt.anomalousSettings.actions];
                if (actionIndex >= 0 && actionIndex < updatedActions.length) {
                    updatedActions.splice(actionIndex, 1);
                }
                return {
                    ...opt,
                    anomalousSettings: {
                        ...opt.anomalousSettings,
                        actions: updatedActions
                    }
                };
            }
            return opt;
        })
    };
};

export const appendAlternativeToAction = (
    question: OptionsQuestion, 
    optionCode: string, 
    actionIndex: number
): OptionsQuestion => {
    return {
        ...question,
        options: question.options.map(opt => {
            if (opt.code === optionCode && opt.anomalousSettings) {
                const updatedActions = [...opt.anomalousSettings.actions];
                if (actionIndex >= 0 && actionIndex < updatedActions.length) {
                    const action = updatedActions[actionIndex];
                    const newAlternative = {
                        description: "",
                        alternatives: undefined
                    };
                    updatedActions[actionIndex] = {
                        ...action,
                        alternatives: [...(action.alternatives || []), newAlternative]
                    };
                }
                return {
                    ...opt,
                    anomalousSettings: {
                        ...opt.anomalousSettings,
                        actions: updatedActions
                    }
                };
            }
            return opt;
        })
    };
};

export const removeAlternativeFromAction = (
    question: OptionsQuestion, 
    optionCode: string, 
    actionIndex: number, 
    alternativeIndex: number
): OptionsQuestion => {
    return {
        ...question,
        options: question.options.map(opt => {
            if (opt.code === optionCode && opt.anomalousSettings) {
                const updatedActions = [...opt.anomalousSettings.actions];
                if (actionIndex >= 0 && actionIndex < updatedActions.length) {
                    const action = updatedActions[actionIndex];
                    if (action.alternatives && alternativeIndex >= 0 && alternativeIndex < action.alternatives.length) {
                        const updatedAlternatives = [...action.alternatives];
                        updatedAlternatives.splice(alternativeIndex, 1);
                        updatedActions[actionIndex] = {
                            ...action,
                            alternatives: updatedAlternatives
                        };
                    }
                }
                return {
                    ...opt,
                    anomalousSettings: {
                        ...opt.anomalousSettings,
                        actions: updatedActions
                    }
                };
            }
            return opt;
        })
    };
};

// Helper function to find an action or alternative at a specific path
const findActionAtPath = (
    actions: Array<any>,
    path: number[]
): { action: any, parent: any[], index: number } | null => {
    if (path.length === 0) return null;

    let current = actions;
    let parent = actions;
    let index = path[0];

    for (let i = 0; i < path.length; i++) {
        const idx = path[i];
        if (idx < 0 || idx >= current.length) return null;

        if (i === path.length - 1) {
            return { action: current[idx], parent: current, index: idx };
        }

        parent = current;
        current = current[idx].alternatives || [];
    }

    return null;
};

// Add an alternative to an action or another alternative at any level
export const appendNestedAlternative = (
    question: OptionsQuestion,
    optionCode: string,
    path: number[]
): OptionsQuestion => {
    return {
        ...question,
        options: question.options.map(opt => {
            if (opt.code === optionCode && opt.anomalousSettings) {
                const updatedActions = [...opt.anomalousSettings.actions];

                if (path.length === 1) {
                    // Direct action - same as appendAlternativeToAction
                    const actionIndex = path[0];
                    if (actionIndex >= 0 && actionIndex < updatedActions.length) {
                        const action = updatedActions[actionIndex];
                        const newAlternative = {
                            description: "",
                            alternatives: undefined
                        };
                        updatedActions[actionIndex] = {
                            ...action,
                            alternatives: [...(action.alternatives || []), newAlternative]
                        };
                    }
                } else if (path.length > 1) {
                    // Nested alternative
                    const result = findActionAtPath(updatedActions, path);
                    if (result) {
                        const { action, parent, index } = result;
                        const newAlternative = {
                            description: "",
                            alternatives: undefined
                        };
                        parent[index] = {
                            ...action,
                            alternatives: [...(action.alternatives || []), newAlternative]
                        };
                    }
                }

                return {
                    ...opt,
                    anomalousSettings: {
                        ...opt.anomalousSettings,
                        actions: updatedActions
                    }
                };
            }
            return opt;
        })
    };
};

// Remove an alternative from an action or another alternative at any level
export const removeNestedAlternative = (
    question: OptionsQuestion,
    optionCode: string,
    path: number[],
    alternativeIndex: number
): OptionsQuestion => {
    return {
        ...question,
        options: question.options.map(opt => {
            if (opt.code === optionCode && opt.anomalousSettings) {
                const updatedActions = [...opt.anomalousSettings.actions];

                if (path.length === 0) return opt;

                const result = findActionAtPath(updatedActions, path);
                if (result) {
                    const { action, parent, index } = result;
                    if (action.alternatives && alternativeIndex >= 0 && alternativeIndex < action.alternatives.length) {
                        const updatedAlternatives = [...action.alternatives];
                        updatedAlternatives.splice(alternativeIndex, 1);
                        parent[index] = {
                            ...action,
                            alternatives: updatedAlternatives
                        };
                    }
                }

                return {
                    ...opt,
                    anomalousSettings: {
                        ...opt.anomalousSettings,
                        actions: updatedActions
                    }
                };
            }
            return opt;
        })
    };
};
