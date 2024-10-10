import {setHook} from "react-hooks-outside";
import {useUpdateModal} from "./providers";

export const hooks = {
  useUpdateModal: "useUpdateModal",
};

export const initializeHooks = () => {
  setHook(hooks.useUpdateModal, useUpdateModal);
};
