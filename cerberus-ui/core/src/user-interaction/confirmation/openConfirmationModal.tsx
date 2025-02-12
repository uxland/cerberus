import React from 'react';
import { ConfirmationResult, ConfirmOptions } from "./confirmation-manager";
import { useUpdateModal } from "../../providers";

export function openConfirmationModal<TPayload = undefined>(options: ConfirmOptions<TPayload>): Promise<ConfirmationResult> {
  return new Promise<ConfirmationResult>((resolve) => {
    const updateModal = useUpdateModal();
    console.log("options", options);
    const handleConfirm = () => {
      resolve("yes");
      updateModal(null);
    };

    const handleCancel = () => {
      resolve("no");
      updateModal(null);
    };

    updateModal({
      title: options.title,
      maxWidth: "lg",
      closeAction: true,
      className: "",
      content: () => (
        <div className="flex flex-col justify-center items-center gap-4">
          <h1>{options.message}</h1>
          <div className="flex gap-4">
            <button onClick={handleConfirm}>Yes</button>
            <button onClick={handleCancel}>No</button>
          </div>
        </div>
      ),
    });
  });
}