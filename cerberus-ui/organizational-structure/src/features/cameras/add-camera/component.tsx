import {notificationService} from "@cerberus/core";
import {
  useUpdateModal,
  useUpdateModalActions,
} from "@cerberus/core/src/providers";
import {Button} from "@mui/material";
import {Mediator} from "mediatr-ts";
import {useEffect, useState} from "react";
import {useOrganizationalStructureLocales} from "../../../locales/ca/locales";
import {AddCamera} from "../../../ui-components/add-camera/component";
import {AddCamera as AddCameraCommand} from "./command";

export const AddCameraModal = (parentId: string) => {
  const updateModal = useUpdateModal();
  const updateModalActions = useUpdateModalActions();

  const [formData, setFormData] = useState<{
    cameraDescription: string;
    capturePattern: string;
    cameraUrl: string;
    user: string;
    password: string;
  }>({
    cameraDescription: "",
    capturePattern: "",
    cameraUrl: "",
    user: "",
    password: "",
  });

  const handleChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({...prev, [field]: value}));
  };

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
          formData.cameraDescription, // TODO quina hauria de ser ID
          parentId,
          formData.cameraDescription,
          formData.capturePattern, // TODO afegir patro de captura
          formData.cameraUrl,
          {username: formData.user, password: formData.password}
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
      title: "Afegir un nou Dispositiu",
      maxWidth: "lg",
      closeAction: true,
      className: "",
      content: () => (
        <AddCamera
          onCameraDescriptionChange={handleChange("cameraDescription")}
          onCapturePatternChange={handleChange("capturePattern")}
          onUrlChange={handleChange("cameraUrl")}
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
