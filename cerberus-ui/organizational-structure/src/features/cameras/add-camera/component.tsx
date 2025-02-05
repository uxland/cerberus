import {notificationService} from "@cerberus/core";
import {
  useUpdateModal,
  useUpdateModalActions,
} from "@cerberus/core/src/providers";
import {Button} from "@mui/material";
import {Mediator} from "mediatr-ts";
import {useEffect, useState} from "react";
import {useOrganizationalStructureLocales} from "../../../locales/ca/locales";
import {AddCamera as AddCameraCommand} from "./command";
import {AddEditCameraForm} from "../components/AddCameraForm";
import {isValid, LocationSettings} from "../../locations/location-detail/show-location-settings/model.ts";

export const AddCameraModal = (parentId: string) => {
  const updateModal = useUpdateModal();
  const updateModalActions = useUpdateModalActions();

  const [editedSettings, setEditedSettings] = useState<LocationSettings | undefined>(undefined)

  const successMessage: string = useOrganizationalStructureLocales(
    "addCamera.notifcation.success"
  );
  const errorMessage: string = useOrganizationalStructureLocales(
    "addCamera.notifcation.error"
  );

  const handleSubmit = async () => {
    const mediator = new Mediator();
    try {
      await mediator.send(
        new AddCameraCommand(
          editedSettings.id,
          parentId,
          editedSettings.description,
          editedSettings?.adminSettings?.captureRecurrencePattern,
          editedSettings?.adminSettings.ipAddress,
          editedSettings?.adminSettings?.cameraCredentials
        )
      );
      notificationService.notifySuccess(successMessage);
    } catch (e) {
      notificationService.notifyError(errorMessage, e.message);
      console.error(e.message);
    }
    updateModal(null);
  };

  const openModal = () => {
    updateModal({
      title: "Afegir una nova Càmera",
      maxWidth: "lg",
      closeAction: true,
      className: "",

      content: () => (
        <AddEditCameraForm
          showCameraCode={true}
          settings={undefined}
            onModelChanged={setEditedSettings}
        />
      ),
      actions: [
        {
          id: "submit",
          sort: 0,
          content: () => (
            <Button
              variant="contained"
              size="small"
              color="success"
              fullWidth
              disabled={!isValid(editedSettings)}
              className="!rounded-2xl !w-52 !text-white !bg-[#afafaf]"
              onClick={handleSubmit}>
              {useOrganizationalStructureLocales("addCamera.submitBtn")}
            </Button>
          ),
        },
      ],
    });
  };
  useEffect(() => {
    updateModalActions([
      {
        id: "submit",
        sort: 0,
        content: () => (
          <Button
            variant="contained"
            size="small"
            color="success"
            fullWidth
            className={`!rounded-2xl !w-52 !text-white ${
              editedSettings?.description ? "!bg-[#02bc77]" : "!bg-[#afafaf]"
            }`}
            disabled={!isValid(editedSettings)}
            onClick={handleSubmit}>
            {useOrganizationalStructureLocales("addLocation.submitBtn")}
          </Button>
        ),
      },
    ]);
  }, [editedSettings]);

  return openModal;
};
