import { Trigger, OperationAction, OperationQuestion } from "./model.ts";
import { OptionsQuestion } from "./options-question.ts";

export const updateActionTrigger = <T extends string | number>(
    question: OperationQuestion<T>,
    trigger: Trigger<T>
): OperationQuestion<T> => {
    const existing = question.triggers || [];

    const updatedTriggers = existing
        .map(t => t.id === trigger.id ? trigger : t)
        .filter(t => !(t.id === trigger.id && t.actions === undefined));

    return {
        ...question,
        triggers: updatedTriggers.length > 0 ? updatedTriggers : undefined
    };
};

export const findTrigger = (question: OperationQuestion, triggerId: string) => {
    return (question.triggers || []).find(x => x.id === triggerId);
}

export const existsTrigger = (question: OperationQuestion, triggerId: string) => findTrigger(question, triggerId) !== undefined;

export const getTriggerActions = (question: OperationQuestion, triggerId: string) =>
    findTrigger(question, triggerId)?.actions || [];

export const addAlternativeToAction = (question: OperationQuestion, triggerId: string, actionIndex: number) => {
    let trigger = findTrigger(question, triggerId);
    if (!trigger) return question;
    trigger = {
        ...trigger, actions: trigger.actions.map((act, idx) => {
            if (idx !== actionIndex) return act;
            return { ...act, alternatives: [...(act.alternatives ?? []), { description: "", alternatives: [] }] };
        })
    };
    return updateActionTrigger(question, trigger) as OptionsQuestion;
}
export const appendAction = (question: OperationQuestion, triggerId: string, path: number[] | string[] = []) => {
    let trigger = findTrigger(question, triggerId);
    if (!trigger) return question;

    const numericPath: number[] = path.map(p => typeof p === 'string' ? Number.parseInt(p, 10) : p);

    const newAction: OperationAction = { description: "", alternatives: undefined };

    if (numericPath.length === 0) {
        // Add a new action at the root level
        trigger = {
            ...trigger,
            actions: [...(trigger.actions || []), newAction]
        };
    } else {
        // Add a new action as an alternative to an existing action
        const actionIndex = numericPath[0];
        const restPath = numericPath.slice(1);

        trigger = {
            ...trigger,
            actions: trigger.actions.map((act, idx) => {
                if (idx !== actionIndex) return act;

                if (restPath.length === 0) {
                    // Add as a direct alternative to this action
                    return {
                        ...act,
                        alternatives: [...(act.alternatives || []), newAction]
                    };
                } else {
                    // Add at a deeper nesting level
                    return {
                        ...act,
                        alternatives: appendAtPath(act.alternatives || [], restPath, newAction)
                    };
                }
            })
        };
    }

    return updateActionTrigger(question, trigger);
}

export const removeAction = (question: OperationQuestion, triggerId: string, path: number[] | string[] = []) => {
    let trigger = findTrigger(question, triggerId);
    if (!trigger) return question;

    const numericPath: number[] = path.map(p => typeof p === 'string' ? Number.parseInt(p, 10) : p);

    if (numericPath.length === 0) {
        // Nothing to remove if path is empty
        return question;
    } else {
        // Remove an action based on the path
        const actionIndex = numericPath[0];
        const restPath = numericPath.slice(1);

        if (restPath.length === 0) {
            // Remove action at the root level
            trigger = {
                ...trigger,
                actions: trigger.actions.filter((_, idx) => idx !== actionIndex)
            };
        } else {
            // Remove action at a deeper level
            trigger = {
                ...trigger,
                actions: trigger.actions.map((act, idx) => {
                    if (idx !== actionIndex) return act;
                    return {
                        ...act,
                        alternatives: removeAtPath(act.alternatives || [], restPath)
                    };
                })
            };
        }
    }

    return updateActionTrigger(question, trigger);
}
function appendAtPath(
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
                    ? appendAtPath(alt.alternatives ?? [], rest, newAlt)
                    : [...(alt.alternatives ?? []), newAlt]
        };
    });
}

/** Recursively descend into `alternatives`, following `path`, and remove the item at that index. */
function removeAtPath(
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
            alternatives: removeAtPath(alt.alternatives ?? [], rest)
        };
    });
}
