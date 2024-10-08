import {SlideDirection} from "@cerberus/core";
import {
  ModalActions,
  useModal,
  useUpdateModal,
} from "@cerberus/core/src/providers";
import CancelIcon from "@mui/icons-material/Cancel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import React, {useEffect, useState} from "react";
import {transitionSelector} from "./Transitions";

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  closeAction?: boolean;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const {children, closeAction, onClose, ...other} = props;

  return (
    <>
      <DialogTitle
        className={`${closeAction}`}
        sx={{color: "#ffc200"}}
        {...other}>
        {children}
      </DialogTitle>
      {closeAction ? (
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}>
          <CancelIcon className="!fill-error" />
        </IconButton>
      ) : null}
    </>
  );
}

const renderContent = (Content: React.FC, data?: any) => <Content {...data} />;

const renderActions = (actions: ModalActions[], data?: any) =>
  actions.map((Content) => <Content.content key={Content.id} {...data} />);

export const ModalContainer = () => {
  const config = useModal();
  const updateModal = useUpdateModal();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (config?.content) setOpen(true);
    else setOpen(false);
  }, [config]);

  const handleClose = () => {
    setOpen(false);
    if (config?.onClose) {
      config.onClose();
    }
    setTimeout(() => updateModal(null as any), 500);
  };

  return (
    <Dialog
      className={config?.className}
      fullScreen={config?.fullScreen}
      fullWidth={config?.fullWidth}
      maxWidth={config?.maxWidth}
      onClose={handleClose}
      scroll={config?.scroll || "paper"}
      open={open}
      keepMounted
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#000",
          color: "#fff",
          fontWeight: "600",
          borderRadius: "8px",
          border: "2px solid",
          borderColor: "#ffc200 !important",
        },
      }}
      TransitionComponent={transitionSelector(
        config?.slideDirection as SlideDirection
      )}>
      {config?.title && (
        <BootstrapDialogTitle
          closeAction={config?.closeAction}
          id="customized-dialog-title"
          onClose={handleClose}>
          {config?.title}
        </BootstrapDialogTitle>
      )}
      <DialogContent dividers sx={{minHeight: config?.minHeight}}>
        {config?.content && renderContent(config?.content)}
      </DialogContent>
      {config?.actions && (
        <DialogActions sx={{padding: "16px 24px"}}>
          {config?.actions && renderActions(config?.actions)}
        </DialogActions>
      )}
    </Dialog>
  );
};
