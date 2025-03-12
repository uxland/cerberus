import {
    ConfirmationContentProps,
    ConfirmationOptions,
    ConfirmationResult,
    InteractionService
} from "./interaction-service";
import * as React from "react";
import { useEffect, useState, ComponentType } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { createRoot } from "react-dom/client";
import { interfaces } from "inversify";
import { ConfirmationMessage } from "./confirmation-message.tsx";
import ServiceIdentifier = interfaces.ServiceIdentifier;

const defaultOptions: ConfirmationOptions = {
    title: "Confirmation",
    showTitle: true,
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
}

//@injectable()
export class InteractionServiceImpl extends InteractionService {


    confirm<TData = undefined, TResult = undefined>(data: TData | undefined, dialogKey: ServiceIdentifier, options?: ConfirmationOptions | undefined): Promise<ConfirmationResult<TResult | undefined>> {
        const finalOptions: ConfirmationOptions = { ...defaultOptions, ...options || {} };
        const DialogComponent = this.container.get<ComponentType<ConfirmationContentProps<TData, TResult>>>(dialogKey);
        return new Promise((resolve) => {
            const div = document.createElement("div");
            document.body.appendChild(div);

            const DialogWrapper = () => {
                const [open, setOpen] = useState(true);
                const [result, setResult] = useState<ConfirmationResult<TResult | undefined>>(undefined);
                const [isValid, setIsValid] = useState(true);

                useEffect(() => {
                    return () => {
                        document.body.removeChild(div);
                    };
                });

                const handleClose = (confirmed: boolean) => {
                    setOpen(false);
                    setTimeout(() => {
                        const confirmationResult = { result: confirmed ? result : undefined, confirmed: confirmed };
                        resolve(confirmationResult);
                    }, 300);
                };
                return (
                    <Dialog open={open} onClose={() => handleClose(false)}>
                        <div className="bg-black text-primary border-2 border-primary">
                            {finalOptions.showTitle && <DialogTitle>{finalOptions.title}</DialogTitle>}
                            <DialogContent className="text-white">
                                <DialogComponent {...{
                                    data,
                                    setResult,
                                    setIsValid,
                                    confirm: () => isValid && handleClose(true),
                                    cancel: () => handleClose(false),
                                }} />
                            </DialogContent>
                            <DialogActions hidden={!finalOptions.showCancelButton && !finalOptions.showConfirmButton}>
                                {finalOptions.showCancelButton && (
                                    <Button
                                        className="!text-primary hover:!bg-primary/10 transition-colors duration-200"
                                        onClick={() => handleClose(false)}
                                    >
                                        {finalOptions.cancelButtonText}
                                    </Button>
                                )}
                                {finalOptions.showConfirmButton && (
                                    <Button
                                        className="!text-primary hover:!bg-primary/10 transition-colors duration-200"
                                        onClick={() => handleClose(true)}
                                        disabled={!isValid}
                                    >
                                        {finalOptions.confirmButtonText}
                                    </Button>
                                )}
                            </DialogActions>
                        </div>
                    </Dialog>
                );
            }

            const root = createRoot(div);
            root.render(<DialogWrapper />);
        })
    }

    confirmMessage(message: string, options?: ConfirmationOptions | undefined): Promise<ConfirmationResult> {
        return this.confirm(message, ConfirmationMessage, options);
    }
}