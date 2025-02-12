import {useUpdateModal, useUpdateModalActions,} from "@cerberus/core/src/providers";
import {Button} from "@mui/material";
import {useEffect, useState} from "react";
import {useOrganizationalStructureLocales} from "../../locales/ca/locales";
import {AddEditCameraForm, AddEditLocationForm} from "../../ui-components";
import {isValid, LocationSettings} from "../locations/location-detail/show-location-settings/model";
import {HierarchyItemType} from "../state/hierarchy-item";
import {notificationService} from "@cerberus/core";
import {Mediator} from "mediatr-ts";
import {AddCamera} from "../cameras/add-camera/command.ts";
import {AddLocation} from "../locations/add-location/command.ts";

export const EditSettings = (
  settings: LocationSettings,
  itemType: HierarchyItemType
) => {
  const updateModal = useUpdateModal();
  const updateModalActions = useUpdateModalActions();
  const [editedSettings, setEditedSettings] = useState<LocationSettings | undefined>(undefined)

  const successMessage: string = useOrganizationalStructureLocales(
    "editCamera.notifcation.success"
  );
  const errorMessage: string = useOrganizationalStructureLocales(
    "editCamera.notifcation.error"
  );

  const handleSubmit = async () => {
    const command = itemType === HierarchyItemType.camera ? createEditCamera(editedSettings) : createEditLocation(editedSettings);
    try {
      await new Mediator().send(command);
      notificationService.notifySuccess(successMessage);
      updateModal(null);
    }
    catch (e){
      notificationService.notifyError(errorMessage, e.message);
    }
  };

  const createEditCamera = (settings: LocationSettings) => {
    return new AddCamera(
        settings.id,
        settings.parentId,
        settings.description,
        settings.adminSettings?.captureRecurrencePattern,
        settings.adminSettings?.ipAddress,
        settings.adminSettings?.cameraCredentials,
        settings.brandName,
        settings.modelName,
        settings.price,
        settings.manufactureYear
    )
  }

  const createEditLocation = (settings: LocationSettings) => {
    return new AddLocation(
        settings.parentId,
        settings.id,
        settings.description,
        settings.adminSettings?.captureRecurrencePattern,
        settings.adminSettings.cameraCredentials
    )
  }

  const openModal = () => {
    updateModal({
      title: `${
        itemType === HierarchyItemType.camera
          ? "Editar paràmetres de Càmera"
          : "Editar paràmetres de Localització"
      }`,
      maxWidth: "lg",
      closeAction: true,
      className: "",

      content: () =>
        itemType === HierarchyItemType.camera ? (
          <AddEditCameraForm
            showCameraCode={false}
            settings={settings}
            onModelChanged={setEditedSettings}
          />
        ) : (
          <AddEditLocationForm
            showCameraCode={false}
            settings={settings}
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
              disabled={!isValid(itemType, editedSettings)}
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
            disabled={!isValid(itemType, editedSettings)}
            onClick={handleSubmit}>
            {useOrganizationalStructureLocales("addLocation.submitBtn")}
          </Button>
        ),
      },
    ]);
  }, [editedSettings]);

  return openModal;
};
