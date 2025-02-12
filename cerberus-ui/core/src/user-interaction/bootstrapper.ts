import {Container} from "inversify";
import {useConfirmation} from "./confirmation";

export const useUserInteraction = (container: Container) => {
    return useConfirmation(container);
}