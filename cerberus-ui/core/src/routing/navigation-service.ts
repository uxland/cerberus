
export type NavigateFunction= (to: string, options:{replace?: boolean, state?: unknown}) => void

export abstract class NavigationService {
    abstract navigateTo(path: string): void;
    abstract navigateBack(): void;
    abstract setNavigateFunction(navigate: NavigateFunction): void;
}


class NavigationServiceImpl extends NavigationService {
    private navigate?: NavigateFunction = undefined;
    setNavigateFunction(navigate: NavigateFunction): void {
        this.navigate = navigate;
    }
    navigateTo(path: string): void {
        if(this.navigate){
            this.navigate(path, {replace: false, state: undefined});
        } else {
            console.log("Navigation function not set")
        }
    }
    navigateBack(): void {
        window.history.back();
    }
}

export const navigationService: NavigationService = new NavigationServiceImpl();