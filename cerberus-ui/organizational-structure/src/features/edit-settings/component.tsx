import {
  useUpdateModal,
  useUpdateModalActions,
} from "@cerberus/core/src/providers";
import {Button} from "@mui/material";
import {Mediator} from "mediatr-ts";
import {useEffect, useState} from "react";
import {useOrganizationalStructureLocales} from "../../locales/ca/locales";
import {AddEditCameraForm, AddEditLocationForm} from "../../ui-components";
import {LocationSettings} from "../locations/location-detail/show-location-settings/model";
import {HierarchyItemType} from "../state/hierarchy-item";

export const EditSettings = (
  settings: LocationSettings,
  itemType: HierarchyItemType
) => {
  const updateModal = useUpdateModal();
  const updateModalActions = useUpdateModalActions();

  const [formData, setFormData] = useState<{
    cameraDescription: string;
    locationDescription: string;
    capturePattern: string;
    cameraUrl: string;
    user: string;
    password: string;
  }>({
    cameraDescription: "",
    locationDescription: "",
    capturePattern: "",
    cameraUrl: "",
    user: "",
    password: "",
  });

  const handleChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({...prev, [field]: value}));
  };

  const successMessage: string = useOrganizationalStructureLocales(
    "editCamera.notifcation.success"
  );
  const errorMessage: string = useOrganizationalStructureLocales(
    "editCamera.notifcation.error"
  );

  const handleSubmit = async () => {
    const mediator = new Mediator();
    console.log("Edti càmera paramters", formData);
    // Falta la llogica de editar la càmera / localitzacio

    // try {
    //   await mediator.send(
    //     new EditCameraCommand(
    //       formData.cameraCode,
    //       settings.parentId,
    //       formData.cameraDescription,
    //       formData.capturePattern,
    //       formData.cameraUrl,
    //       {username: formData.user, password: formData.password}
    //     )
    //   );
    //   notificationService.notifySuccess(successMessage);
    // } catch (e) {
    //   notificationService.notifyError(errorMessage, e.message);
    //   console.error(e.message);
    // }
    // updateModal(null);
  };

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
            onCameraDescriptionChange={handleChange("cameraDescription")}
            onCapturePatternChange={handleChange("capturePattern")}
            onUrlChange={handleChange("cameraUrl")}
            onUserChange={handleChange("user")}
            onPasswordChange={handleChange("password")}
          />
        ) : (
          <AddEditLocationForm
            showCameraCode={false}
            onLocationDescriptionChange={handleChange("locationDescription")}
            onCapturePatternChange={handleChange("capturePattern")}
            onUserChange={handleChange("user")}
            onPasswordChange={handleChange("password")}
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
              disabled={!formData.cameraUrl || !formData.cameraDescription}
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
              formData.cameraDescription ? "!bg-[#02bc77]" : "!bg-[#afafaf]"
            }`}
            disabled={!formData.cameraUrl || !formData.cameraDescription}
            onClick={handleSubmit}>
            {useOrganizationalStructureLocales("addLocation.submitBtn")}
          </Button>
        ),
      },
    ]);
  }, [formData]);

  return openModal;
};
