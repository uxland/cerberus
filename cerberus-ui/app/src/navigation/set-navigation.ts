import {IRequest, IRequestHandler, requestHandler} from "mediatr-ts";
import {NavigateFunction} from "react-router-dom";
import {NavigationService} from "@cerberus/core/src/routing/navigation-service.ts";
import {inject, injectable} from "inversify";

export class SetNavigation implements IRequest<void> {
  constructor(public navigate: NavigateFunction) {}
}

@injectable()
class SetNavigationHandler implements IRequestHandler<SetNavigation, void> {
    constructor(@inject(NavigationService) private navigationService: NavigationService) {}

    handle(value: SetNavigation): Promise<void> {
        this.navigationService.setNavigateFunction(value.navigate);
        return Promise.resolve();
    }
}

export const bootstrapNavigation = () =>{
    requestHandler(SetNavigation)(SetNavigationHandler);
}