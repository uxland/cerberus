import {ConfirmationManager, ConfirmationResult, ConfirmOptions} from "./confirmation-manager.ts";
import {Container} from "inversify";
import {useModal} from "../../providers";

class ReactConfirmationManager extends ConfirmationManager {
    confirm<TPayload = undefined>(options: ConfirmOptions<TPayload>): Promise<ConfirmationResult> {
        const result =window.confirm(options.message);
        useModal()
        return Promise.resolve(result ? "yes" : "no");
    }

}

export const useReactConfirmationManager = (container: Container) => {
    container.bind(ConfirmationManager).to(ReactConfirmationManager).inTransientScope();
    return Promise.resolve(container);
}