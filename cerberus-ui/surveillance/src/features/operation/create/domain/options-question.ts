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
            if (opt.code !== optionCode) return opt;

            // nuevo action con posibilidad de alternativas anidadas
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