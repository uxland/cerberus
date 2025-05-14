import { OperationQuestion, AnomalousSettings, OperationAction } from "./model.ts";

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
    const anomalousSettings: AnomalousSettings<boolean> = {
        actions: [],
        value: false
    };
    const option = <Option>{
        code: code || createOptionId(question),
        text: "",
        anomalousSettings
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
            if (opt.code !== optionCode) return opt;

            const newAction: OperationAction = {
                description: "",
                alternatives: []
            };

            const prev = opt.anomalousSettings;
            const updated: AnomalousSettings = {
                actions: [...(prev?.actions ?? []), newAction],
                value: prev?.value
            };

            return {
                ...opt,
                anomalousSettings: updated
            };
        })
    };
};

export const removeActionFromOption = (question: OptionsQuestion, optionCode: string, actionIndex: number): OptionsQuestion => {
    return {
        ...question,
        options: question.options.map(opt => {
            if (opt.code !== optionCode || !opt.anomalousSettings) return opt;

            const prev = opt.anomalousSettings;
            const actions = [...prev.actions];
            if (actionIndex >= 0 && actionIndex < actions.length) {
                actions.splice(actionIndex, 1);
            }

            return {
                ...opt,
                anomalousSettings: {
                    actions,
                    value: prev.value
                }
            };
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
            if (opt.code !== optionCode || !opt.anomalousSettings) return opt;
            const prev = opt.anomalousSettings;
            const actions = prev.actions.map((act, idx) => {
                if (idx !== actionIndex) return act;
                const newAlt: OperationAction = { description: "", alternatives: [] };
                return {
                    ...act,
                    alternatives: [...(act.alternatives ?? []), newAlt]
                };
            });
            return {
                ...opt,
                anomalousSettings: {
                    ...prev,
                    actions
                }
            };
        })
    };
};

export const removeAlternativeFromAction = (
    question: OptionsQuestion,
    optionCode: string,
    actionIndex: number,
    altIndex: number
): OptionsQuestion => {
    return {
        ...question,
        options: question.options.map(opt => {
            if (opt.code !== optionCode || !opt.anomalousSettings) return opt;
            const prev = opt.anomalousSettings;
            const actions = prev.actions.map((act, idx) => {
                if (idx !== actionIndex) return act;
                const alts = [...(act.alternatives ?? [])];
                alts.splice(altIndex, 1);
                return {
                    ...act,
                    alternatives: alts
                };
            });
            return {
                ...opt,
                anomalousSettings: {
                    ...prev,
                    actions
                }
            };
        })
    };
};
export const appendNestedAlternative = (
    question: OptionsQuestion,
    optionCode: string,
    actionIndex: number,
    alternativePath: number[]
): OptionsQuestion => {
    const newAlternative: OperationAction = { description: "", alternatives: [] };

    return {
        ...question,
        options: question.options.map(opt => {
            if (opt.code !== optionCode || !opt.anomalousSettings) return opt;

            const updatedActions = opt.anomalousSettings.actions.map((act, idx) =>
                idx === actionIndex
                    ? {
                        ...act,
                        alternatives: _appendAtPath(act.alternatives ?? [], alternativePath, newAlternative)
                    }
                    : act
            );

            return {
                ...opt,
                anomalousSettings: { ...opt.anomalousSettings, actions: updatedActions }
            };
        })
    };
};

/** 
 * Remove the alternative at the given nesting path 
 */
export const removeNestedAlternative = (
    question: OptionsQuestion,
    optionCode: string,
    actionIndex: number,
    alternativePath: number[]
): OptionsQuestion => {
    return {
        ...question,
        options: question.options.map(opt => {
            if (opt.code !== optionCode || !opt.anomalousSettings) return opt;

            const updatedActions = opt.anomalousSettings.actions.map((act, idx) =>
                idx === actionIndex
                    ? {
                        ...act,
                        alternatives: _removeAtPath(act.alternatives ?? [], alternativePath)
                    }
                    : act
            );

            return {
                ...opt,
                anomalousSettings: { ...opt.anomalousSettings, actions: updatedActions }
            };
        })
    };
};

/** Recursively descend into `alternatives`, following `path`, and append `newAlt`. */
export function _appendAtPath(
    alternatives: OperationAction[],
    path: number[],
    newAlt: OperationAction
): OperationAction[] {
    if (path.length === 0) {
        // no index specified ⇒ append at this level
        return [...alternatives, newAlt];
    }

    const [currentIndex, ...rest] = path;
    return alternatives.map((alt, idx) => {
        if (idx !== currentIndex) return alt;
        return {
            ...alt,
            alternatives:
                rest.length > 0
                    ? _appendAtPath(alt.alternatives ?? [], rest, newAlt)
                    : [...(alt.alternatives ?? []), newAlt]
        };
    });
}

/** Recursively descend into `alternatives`, following `path`, and remove the item at that index. */
export function _removeAtPath(
    alternatives: OperationAction[],
    path: number[]
): OperationAction[] {
    if (path.length === 0) {
        // nothing to remove
        return alternatives;
    }

    const [currentIndex, ...rest] = path;
    if (rest.length === 0) {
        // remove at this level
        return alternatives.filter((_, idx) => idx !== currentIndex);
    }

    return alternatives.map((alt, idx) => {
        if (idx !== currentIndex) return alt;
        return {
            ...alt,
            alternatives: _removeAtPath(alt.alternatives ?? [], rest)
        };
    });
}

/**
 * Helper function to recursively add alternative to a nested structure
 */

function addNestedAlternativeToActionArray(
    actions: OperationAction[],
    actionIndex: number,
    alternativePath: number[],
    newAlternative: OperationAction
): OperationAction[] {
    console.log(`Adding alternative to action ${actionIndex}, path: ${alternativePath.join('-')}`);

    if (alternativePath.length === 0) {
        // Add directly to the action
        const updatedActions = [...actions];
        const action = updatedActions[actionIndex];
        if (!action) return actions;

        console.log('Adding alternative directly to action');
        updatedActions[actionIndex] = {
            ...action,
            alternatives: [...(action.alternatives || []), newAlternative]
        };
        return updatedActions;
    }

    // Navigate into the nested structure
    const [currentAltIndex, ...remainingPath] = alternativePath;
    const updatedActions = [...actions];
    const action = updatedActions[actionIndex];

    if (!action || !action.alternatives || currentAltIndex >= action.alternatives.length) {
        console.log('Invalid path, action or alternative not found');
        return actions;
    }

    const updatedAlternatives = [...action.alternatives];
    const currentAlt = updatedAlternatives[currentAltIndex];

    if (remainingPath.length === 0) {
        // Add to this alternative directly
        console.log(`Adding to alternative at index ${currentAltIndex}`);
        updatedAlternatives[currentAltIndex] = {
            ...currentAlt,
            alternatives: [...(currentAlt.alternatives || []), newAlternative]
        };
    } else {
        // Navigate deeper
        console.log(`Navigating deeper to path ${remainingPath.join('-')}`);
        updatedAlternatives[currentAltIndex] = {
            ...currentAlt,
            alternatives: addNestedAlternativeToActionArray(
                currentAlt.alternatives || [],
                0, // For nested alternatives, we always use index 0 as there's only one "action" in this context
                remainingPath,
                newAlternative
            )
        };
    }

    updatedActions[actionIndex] = {
        ...action,
        alternatives: updatedAlternatives
    };

    return updatedActions;
}
/**
 * Helper function to recursively remove alternative from a nested structure
 */
function removeNestedAlternativeFromActionArray(
    actions: OperationAction[],
    actionIndex: number,
    alternativePath: number[]
): OperationAction[] {
    if (alternativePath.length === 1) {
        // Remove directly from this level
        const updatedActions = [...actions];
        const action = updatedActions[actionIndex];
        if (!action || !action.alternatives) return actions;

        const altIndexToRemove = alternativePath[0];
        const updatedAlternatives = [...action.alternatives];
        updatedAlternatives.splice(altIndexToRemove, 1);

        updatedActions[actionIndex] = {
            ...action,
            alternatives: updatedAlternatives
        };
        return updatedActions;
    }

    // Navigate into the nested structure
    const [currentAltIndex, ...remainingPath] = alternativePath;
    const updatedActions = [...actions];
    const action = updatedActions[actionIndex];
    if (!action || !action.alternatives || !action.alternatives[currentAltIndex]) return actions;

    const updatedAlternatives = [...action.alternatives];
    const currentAlt = updatedAlternatives[currentAltIndex];

    updatedAlternatives[currentAltIndex] = {
        ...currentAlt,
        alternatives: removeNestedAlternativeFromActionArray(
            currentAlt.alternatives || [],
            0, // There's only one "action" in the nested structure
            remainingPath
        )
    };

    updatedActions[actionIndex] = {
        ...action,
        alternatives: updatedAlternatives
    };

    return updatedActions;
}