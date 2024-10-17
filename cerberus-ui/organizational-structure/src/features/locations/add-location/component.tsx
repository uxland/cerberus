import {notificationService} from "@cerberus/core";
import {
  useUpdateModal,
  useUpdateModalActions,
} from "@cerberus/core/src/providers";
import {Button} from "@mui/material";
import {Mediator} from "mediatr-ts";
import {useEffect, useState} from "react";
import {useOrganizationalStructureLocales} from "../../../locales/ca/locales";
import {AddLocation} from "../../../ui-components/add-location/component";
import {AddLocation as AddLocationCommand} from "./command";

export const AddLocationModal = (parentId: string) => {
  const updateModal = useUpdateModal();
  const updateModalActions = useUpdateModalActions();

  const [formData, setFormData] = useState<{
    locationDescription: string;
    locationCode: string;
    user: string;
    password: string;
    capturePattern: string;
  }>({
    locationDescription: "",
    locationCode: "",
    user: "",
    password: "",
    capturePattern: "",
  });

  const handleChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({...prev, [field]: value}));
  };

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
          formData.locationCode,
          formData.locationDescription,
          formData.capturePattern,
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
      title: "Afegir una nova localització",
      maxWidth: "lg",
      closeAction: true,
      className: "",
      content: () => (
        <AddLocation
          onLocationDescriptionChange={handleChange("locationDescription")}
          onLocationCodeChange={handleChange("locationCode")}
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
              disabled={!formData.locationCode || !formData.locationDescription}
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
              formData.locationDescription ? "!bg-[#02bc77]" : "!bg-[#afafaf]"
            }`}
            disabled={!formData.locationCode || !formData.locationDescription}
            onClick={handleSubmit}>
            {useOrganizationalStructureLocales("addLocation.submitBtn")}
          </Button>
        ),
      },
    ]);
  }, [formData]);

  return openModal;
};
