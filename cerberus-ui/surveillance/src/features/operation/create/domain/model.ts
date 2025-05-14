import { OptionsTypology, OptionsQuestion, _appendAtPath, _removeAtPath } from "./options-question.ts";

export type OperationQuestionType = "Options" | "Text" | "Integer" | "Float"

export const questionOptionValues: Array<{ value: OperationQuestionType, label: string }> = [
    { value: "Options", label: "Opciones" },
    { value: "Text", label: "Texto" },
    { value: "Integer", label: "Entero" },
    { value: "Float", label: "Decimal" }
]
export const isAnomalousValues: Array<{ value: boolean, label: string }> = [
    { value: true, label: "Sí" },
    { value: false, label: "No" }
]
export interface OperationAction {
    description: string;
    alternatives: Array<OperationAction> | undefined;
}

export interface AnomalousSettings<T extends number | string | boolean | undefined = undefined> {
    actions: OperationAction[];
    value?: T | undefined;
}

export interface OperationQuestion {
    __type: OperationQuestionType;
    id: string;
    text: string;
    isMandatory: boolean;
}

export interface NormalityRange<T extends string | number> {
    lowerBound?: AnomalousSettings<T> | undefined;
    upperBound?: AnomalousSettings<T> | undefined;
}


export interface SurveillanceOperationFormModel {
    description: string;
    questions: OperationQuestion[];
}

export const defaultOperationModel: SurveillanceOperationFormModel = {
    description: "",
    questions: []
}

export const optionTypologyValues: Array<{ value: OptionsTypology, label: string }> = [
    { value: "Single", label: "Única" },
    { value: "Multiple", label: "Múltiple" }
]

export const isMandatoryValues: Array<{ value: boolean, label: string }> = [
    { value: true, label: "Sí" },
    { value: false, label: "No" }
]

export interface TextQuestion extends OperationQuestion {
    __type: "Text";
    minLength: number | undefined;
}
export interface IntegerQuestion extends OperationQuestion {
    __type: "Integer";
    min: number | undefined;
    max: number | undefined;
    normalityRange?: NormalityRange<number>;
}

export interface FloatQuestion extends OperationQuestion {
    __type: "Float";
    min: number | undefined;
    max: number | undefined;
    normalityRange?: NormalityRange<number>;
}

export const setOperationText = (model: SurveillanceOperationFormModel, text: string): SurveillanceOperationFormModel =>
    ({ ...model, description: text });

export const appendQuestion = (model: SurveillanceOperationFormModel, question: OperationQuestion): SurveillanceOperationFormModel =>
    ({ ...model, questions: [...model.questions, question] });

export const setQuestion = (model: SurveillanceOperationFormModel, questionId: string, question: OperationQuestion): SurveillanceOperationFormModel =>
    ({ ...model, questions: model.questions.map(q => q.id === questionId ? question : q) });

export const setQuestionText = (question: OperationQuestion, text: string): OperationQuestion => ({ ...question, text });

export const setQuestionMandatory = (question: OperationQuestion, isMandatory: boolean): OperationQuestion => ({ ...question, isMandatory });

export const removeQuestion = (model: SurveillanceOperationFormModel, questionId: string): SurveillanceOperationFormModel =>
    ({ ...model, questions: model.questions.filter(q => q.id !== questionId) });
export const getQuestionById = (model: SurveillanceOperationFormModel, questionId: string): OperationQuestion | undefined =>
    model.questions.find(q => q.id === questionId);

export const appendLowerBoundAction = <Q extends IntegerQuestion | FloatQuestion>(question: Q): Q => {
    const normalityRange = question.normalityRange ?? {};
    const lowerBound = normalityRange.lowerBound ?? { actions: [], value: undefined };
    const lowerActions = Array.isArray(lowerBound.actions) ? lowerBound.actions : [];
    const newAction: OperationAction = { description: "", alternatives: [] };

    return {
        ...question,
        normalityRange: {
            ...normalityRange,
            lowerBound: {
                ...lowerBound,
                actions: [...lowerActions, newAction],
                value: lowerBound.value
            }
        }
    } as Q;
};

export const removeLowerBoundAction = <Q extends IntegerQuestion | FloatQuestion>(
    question: Q,
    idx: number
): Q => {
    const normalityRange = question.normalityRange ?? {};
    const lowerBound = normalityRange.lowerBound ?? { actions: [], value: undefined };
    const lowerActions = Array.isArray(lowerBound.actions) ? [...lowerBound.actions] : [];

    if (idx >= 0 && idx < lowerActions.length) lowerActions.splice(idx, 1);

    return {
        ...question,
        normalityRange: {
            ...normalityRange,
            lowerBound: {
                ...lowerBound,
                actions: lowerActions,
                value: lowerBound.value
            }
        }
    } as Q;
};

export const appendLowerAlternative = <Q extends IntegerQuestion | FloatQuestion>(
    question: Q,
    actionIndex: number
): Q => {
    const normalityRange = question.normalityRange ?? {};
    const lowerBound = normalityRange.lowerBound ?? { actions: [], value: undefined };
    const lowerActions = Array.isArray(lowerBound.actions) ? [...lowerBound.actions] : [];

    const updatedActions = lowerActions.map((action, index) =>
        index === actionIndex
            ? {
                ...action,
                alternatives: [
                    ...(Array.isArray(action.alternatives) ? action.alternatives : []),
                    { description: "", alternatives: [] }
                ]
            }
            : action
    );

    return {
        ...question,
        normalityRange: {
            ...normalityRange,
            lowerBound: {
                ...lowerBound,
                actions: updatedActions,
                value: lowerBound.value
            }
        }
    } as Q;
};

export const removeLowerAlternative = <Q extends IntegerQuestion | FloatQuestion>(
    question: Q,
    ai: number,
    li: number
): Q => {
    const prev = question.normalityRange?.lowerBound ?? { actions: [], value: undefined };
    const actions = prev.actions.map((act, i) =>
        i === ai
            ? { ...act, alternatives: (act.alternatives ?? []).filter((_, j) => j !== li) }
            : act
    );
    return {
        ...question,
        normalityRange: {
            ...question.normalityRange,
            lowerBound: { actions, value: prev.value }
        }
    } as Q;
};

export const appendUpperBoundAction = <Q extends IntegerQuestion | FloatQuestion>(question: Q): Q => {
    const normalityRange = question.normalityRange ?? {};
    const upperBound = normalityRange.upperBound ?? { actions: [], value: undefined };
    // garantizamos que actions sea array
    const upperActions = Array.isArray(upperBound.actions) ? upperBound.actions : [];
    const newAct: OperationAction = { description: "", alternatives: [] };
    return {
        ...question,
        normalityRange: {
            ...normalityRange,
            upperBound: {
                actions: [...upperActions, newAct],
                value: upperBound.value
            }
        }
    } as Q;
};

export const removeUpperBoundAction = <Q extends IntegerQuestion | FloatQuestion>(
    question: Q,
    idx: number
): Q => {
    const normalityRange = question.normalityRange ?? {};
    const upperBound = normalityRange.upperBound ?? { actions: [], value: undefined };
    // protegemos actions aquí también
    const upperActions = Array.isArray(upperBound.actions) ? [...upperBound.actions] : [];
    if (idx >= 0 && idx < upperActions.length) upperActions.splice(idx, 1);
    return {
        ...question,
        normalityRange: {
            ...normalityRange,
            upperBound: {
                actions: upperActions,
                value: upperBound.value
            }
        }
    } as Q;
};

export const appendUpperAlternative = <Q extends IntegerQuestion | FloatQuestion>(
    question: Q,
    ai: number
): Q => {
    const prev = question.normalityRange?.upperBound ?? { actions: [], value: undefined };
    const actions = prev.actions.map((act, i) =>
        i === ai
            ? { ...act, alternatives: [...(act.alternatives ?? []), { description: "", alternatives: [] }] }
            : act
    );
    return {
        ...question,
        normalityRange: {
            ...question.normalityRange,
            upperBound: { actions, value: prev.value }
        }
    } as Q;
};

export const removeUpperAlternative = <Q extends IntegerQuestion | FloatQuestion>(
    question: Q,
    ai: number,
    li: number
): Q => {
    const prev = question.normalityRange?.upperBound ?? { actions: [], value: undefined };
    const actions = prev.actions.map((act, i) =>
        i === ai
            ? { ...act, alternatives: (act.alternatives ?? []).filter((_, j) => j !== li) }
            : act
    );
    return {
        ...question,
        normalityRange: {
            ...question.normalityRange,
            upperBound: { actions, value: prev.value }
        }
    } as Q;
};

export const appendNestedLowerAlternative = <Q extends IntegerQuestion | FloatQuestion>(
    q: Q,
    ai: number,
    path: number[]
): Q => {
    const lower = q.normalityRange?.lowerBound;
    if (!lower) return q;
    const updated = (lower.actions ?? []).map((act, i) =>
        i === ai
            ? {
                ...act,
                alternatives: _appendAtPath(
                    act.alternatives ?? [],
                    path,                               // aquí va el path[]
                    { description: "", alternatives: [] } // y aquí el newAlt
                )
            }
            : act
    );
    return {
        ...q,
        normalityRange: {
            ...q.normalityRange!,
            lowerBound: { ...lower, actions: updated }
        }
    } as Q;
};

export const removeNestedLowerAlternative = <Q extends IntegerQuestion | FloatQuestion>(
    q: Q,
    actionIndex: number,
    alternativePath: number[]
): Q => {
    const normalityRange = q.normalityRange;
    if (!normalityRange) return q;

    const lowerBound = normalityRange.lowerBound;
    // Ensure lowerBound and its actions array exist
    if (!lowerBound || !Array.isArray(lowerBound.actions)) return q;

    const updatedActions = lowerBound.actions.map((action, idx) => {
        if (idx === actionIndex) {
            // Call _removeAtPath on the specific action's alternatives
            return {
                ...action,
                alternatives: _removeAtPath(action.alternatives ?? [], alternativePath)
            };
        }
        return action;
    });

    return {
        ...q,
        normalityRange: {
            ...normalityRange,
            lowerBound: {
                ...lowerBound,
                actions: updatedActions
            }
        }
    } as Q;
};

export const appendNestedUpperAlternative = <Q extends IntegerQuestion | FloatQuestion>(
    q: Q,
    ai: number,
    path: number[]
): Q => {
    const upper = q.normalityRange?.upperBound;
    if (!upper) return q;
    const updated = (upper.actions ?? []).map((act, i) =>
        i === ai
            ? {
                ...act,
                alternatives: _appendAtPath(
                    act.alternatives ?? [],
                    path,
                    { description: "", alternatives: [] }
                )
            }
            : act
    );
    return {
        ...q,
        normalityRange: {
            ...q.normalityRange!,
            upperBound: { ...upper, actions: updated }
        }
    } as Q;
};

export const removeNestedUpperAlternative = <Q extends IntegerQuestion | FloatQuestion>(
    q: Q,
    actionIndex: number,
    alternativePath: number[]
): Q => {
    const normalityRange = q.normalityRange;
    if (!normalityRange) return q;

    const upperBound = normalityRange.upperBound;
    // Ensure upperBound and its actions array exist
    if (!upperBound || !Array.isArray(upperBound.actions)) return q;

    const updatedActions = upperBound.actions.map((action, idx) => {
        if (idx === actionIndex) {
            // Call _removeAtPath on the specific action's alternatives
            return {
                ...action,
                alternatives: _removeAtPath(action.alternatives ?? [], alternativePath)
            };
        }
        return action;
    });

    return {
        ...q,
        normalityRange: {
            ...normalityRange,
            upperBound: { // Ensure correct property name 'upperBound'
                ...upperBound,
                actions: updatedActions // Ensure correct property name 'actions'
            }
        }
    } as Q;
};