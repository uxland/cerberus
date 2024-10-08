import {Breakpoint} from "@mui/material";
import {
  ReactElement,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import {sliceBuilder} from "../constants/core-constants";
import {SlideDirection} from "../utils";

export interface ModalActions {
  id: string;
  sort: number;
  content: React.FC;
}
export type ModalProviderState = {
  fullScreen?: boolean;
  fullWidth?: boolean;
  minHeight?: string;
  maxHeight?: false | Breakpoint;
  maxWidth?: false | Breakpoint;
  slideDirection?: SlideDirection;
  content: React.FC | null;
  actions?: ModalActions[];
  className?: string;
  title?: string;
  closeAction?: boolean;
  scroll?: "body" | "paper";
  backgroundTitle?: boolean;
  onClose?: () => void;
};

type SetModal = (config: ModalProviderState) => void;
const ModalStateContext = createContext<ModalProviderState | undefined>(
  undefined
);
ModalStateContext.displayName = sliceBuilder("modal-state");
const ModalDispatchContext = createContext<SetModal | undefined>(undefined);
ModalDispatchContext.displayName = sliceBuilder("modal-dispatch");
const ModalActionsDispatchContext =
  createContext<(actions: ModalActions[]) => void | undefined>(undefined);
ModalActionsDispatchContext.displayName = sliceBuilder(
  "modal-actions-dispatch"
);

export const ModalProvider = ({children}: {children: ReactElement}) => {
  const [modal, setModal] = useState<ModalProviderState>({
    fullScreen: true,
    fullWidth: true,
    maxWidth: "xl",
    minHeight: "lg",
    content: null,
    actions: null,
    slideDirection: "up",
    className: "",
    title: "",
    closeAction: false,
    scroll: "paper",
    backgroundTitle: false,
    onClose: null,
  });

  const [actions, setActions] = useState<ModalActions[]>([]);

  useMemo(() => {
    setModal((prevModal) => ({...prevModal, actions}));
  }, [actions]);

  return (
    <ModalStateContext.Provider value={modal}>
      <ModalDispatchContext.Provider value={setModal}>
        <ModalActionsDispatchContext.Provider value={setActions}>
          {children}
        </ModalActionsDispatchContext.Provider>
      </ModalDispatchContext.Provider>
    </ModalStateContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalStateContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const useUpdateModal = () => {
  const context = useContext(ModalDispatchContext);
  if (context === undefined) {
    throw new Error("useUpdateModal must be used within a ModalProvider");
  }
  return context;
};

export const useUpdateModalActions = () => {
  const context = useContext(ModalActionsDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useUpdateModalActions must be used within a ModalProvider"
    );
  }
  return context;
};
