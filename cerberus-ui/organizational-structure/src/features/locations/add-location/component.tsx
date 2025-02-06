import {notificationService} from "@cerberus/core";
import {
  useUpdateModal,
  useUpdateModalActions,
} from "@cerberus/core/src/providers";
import {Button} from "@mui/material";
import {Mediator} from "mediatr-ts";
import {useEffect, useState} from "react";
import {useOrganizationalStructureLocales} from "../../../locales/ca/locales";
import {AddLocation as AddLocationCommand} from "./command";
import {AddEditLocationForm} from "../components/AddLocationForm";
import {isValid, LocationSettings} from "../location-detail/show-location-settings/model.ts";
import { HierarchyItemType } from "../../state/hierarchy-item.ts";

export const AddLocationModal = (parentId: string) => {
  const updateModal = useUpdateModal();
  const updateModalActions = useUpdateModalActions();

  const [editedSettings, setEditedSettings] = useState<LocationSettings | undefined>(undefined)


  const successMessage: string = useOrganizationalStructureLocales(
    "addLocation.notifcation.success"
  );
  const errorMessage: string = useOrganizationalStructureLocales(
    "addLocation.notifcation.error"
  );

  const handleSubmit = async () => {
    const mediator = new Mediator();
    try {
      await mediator.send(
        new AddLocationCommand(
          parentId,
          editedSettings.id,
          editedSettings.description,
          editedSettings.adminSettings?.captureRecurrencePattern,
         editedSettings?.adminSettings.cameraCredentials
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
      title: "Afegir una nova localització",
      maxWidth: "lg",
      closeAction: true,
      className: "",
      content: () => (
        <AddEditLocationForm
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
              {useOrganizationalStructureLocales("addLocation.submitBtn")}
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
              editedSettings?.locationDescription ? "!bg-[#02bc77]" : "!bg-[#afafaf]"
            }`}
            disabled={!isValid(HierarchyItemType.location, editedSettings)}
            onClick={handleSubmit}>
            {useOrganizationalStructureLocales("addLocation.submitBtn")}
          </Button>
        ),
      },
    ]);
  }, [editedSettings]);

  return openModal;
};
