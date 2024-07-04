export const navigateBack = () => window.history.back();

export const navigateBackAfter = (time = 250) => setTimeout(navigateBack, time);