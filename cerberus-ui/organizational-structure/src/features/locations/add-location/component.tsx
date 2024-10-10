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
    console.log(field, value);
    setFormData((prev) => ({...prev, [field]: value}));
  };

  const handleSubmit = async () => {
    const mediator = new Mediator();
    try {
      const location = await mediator.send(
        new AddLocationCommand(
          parentId,
          formData.locationCode,
          formData.locationDescription,
          formData.capturePattern,
          {username: formData.user, password: formData.password}
        )
      );
      console.log(location);
    } catch (e) {
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
    });
  };

  useEffect(() => {
    if (formData.locationCode && formData.locationDescription) {
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
              className="!rounded-2xl !w-52 !text-white !bg-[#02bc77]"
              onClick={handleSubmit}>
              {useOrganizationalStructureLocales("addLocation.submitBtn")}
            </Button>
          ),
        },
      ]);
    }
  }, [formData]);

  return openModal;
};

// // Opció Buttó dins del component
// import {
//   useUpdateModal,
//   useUpdateModalActions,
// } from "@cerberus/core/src/providers";
// import {Button} from "@mui/material";
// import {Mediator} from "mediatr-ts";
// import {useEffect} from "react";
// import {useOrganizationalStructureLocales} from "../../../locales/ca/locales";
// import {AddLocation} from "../../../ui-components/add-location/component";
// import {AddLocation as AddLocationCommand} from "./command";

// export const AddLocationModal = (parentId: string) => {
//   const updateModal = useUpdateModal();
//   const updateModalActions = useUpdateModalActions();

//   const handleSubmit = async (data: {
//     locationDescription: string;
//     locationCode: string;
//     user: string;
//     password: string;
//     capturePattern: string;
//   }) => {
//     const mediator = new Mediator();
//     try {
//       const location = await mediator.send(
//         new AddLocationCommand(
//           parentId,
//           data.locationCode,
//           data.locationDescription,
//           data.capturePattern,
//           {username: data.user, password: data.password}
//         )
//       );
//       console.log(location);
//     } catch (e) {
//       console.error(e.message);
//     }
//     updateModal(null);
//   };

//   const openModal = () => {
//     updateModal({
//       title: "Afegir una nova localització",
//       maxWidth: "lg",
//       closeAction: true,
//       className: "",
//       content: () => (
//         <AddLocation onSubmit={handleSubmit} /> // Pasar la función de envío
//       ),
//     });
//   };

//   return openModal;
// };
