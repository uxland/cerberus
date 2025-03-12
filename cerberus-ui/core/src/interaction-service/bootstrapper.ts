import {Container} from "inversify";
import {InteractionServiceImpl} from "./interaction-service-impl.tsx";
import {InteractionService} from "./interaction-service.ts";
import {ConfirmationMessage} from "./confirmation-message.tsx";

export const userInteractionService = async (container: Container) => {
    await teardownInteractionService(container);
    container.bind(ConfirmationMessage).toConstantValue(ConfirmationMessage);
    container.bind(InteractionService).to(InteractionServiceImpl).inSingletonScope();
    return container;
}

export const teardownInteractionService = (container: Container) => {
    container.isBound(ConfirmationMessage) &&   container.unbind(ConfirmationMessage);
    container.isBound(InteractionService) && container.unbind(InteractionService);
    return Promise.resolve(container);
}