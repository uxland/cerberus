import {Container} from "inversify";
import {useReactConfirmationManager} from "./react-confirmation-manager.ts";

export * from './confirmation-manager.ts'

export const useConfirmation = (container: Container) => useReactConfirmationManager(container);