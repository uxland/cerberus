import { ConfirmationManager, ConfirmationResult, ConfirmOptions } from "./confirmation-manager";
import { Container, injectable } from "inversify";
import { openConfirmationModal } from "./openConfirmationModal";

@injectable()
class ReactConfirmationManager extends ConfirmationManager {
  confirm<TPayload = undefined>(options: ConfirmOptions<TPayload>): Promise<ConfirmationResult> {
    return openConfirmationModal(options);
  }
}

export const useReactConfirmationManager = (container: Container) => {
  container.bind(ConfirmationManager).to(ReactConfirmationManager).inTransientScope();
  return Promise.resolve(container);
};