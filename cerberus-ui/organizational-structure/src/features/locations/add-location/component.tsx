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

// export const AddLocationModal = () => {
//   const updateModal = useUpdateModal();
//   const [location, setLocation] = useState<any>([]);

//   const handleSubmit = async (formData: {
//     locationDescription: string;
//     cameraCode: string;
//     capturePattern: string;
//     user: string;
//     password: string;
//   }) => {
//     const {locationDescription, cameraCode, capturePattern} = formData;
//     const mediator = new Mediator();
//     try {
//       const location = await mediator.send(
//         new AddLocationCommand(
//           "CAT",
//           // "10",
//           locationDescription,
//           cameraCode,
//           capturePattern,
//           {username: formData.user, password: formData.password}
//         )
//       );
//       setLocation(location);
//       console.log(location);
//     } catch (e) {
//       console.error(e.message);
//     }
//   };
//   const openModal = () => {
//     console.log("MODAL: localització");
//     updateModal({
//       title: "Afegir nova localització",
//       maxWidth: "lg",
//       closeAction: true,
//       className: "modal",
//       content: AddLocation,
//       // actions: [
//       //   {
//       //     id: "0",
//       //     sort: 1,
//       //     content: () => (
//       //       <Button
//       //         variant="contained"
//       //         size="small"
//       //         color="success"
//       //         fullWidth
//       //         className="!rounded-2xl !w-52 !text-white !bg-[#02bc77]"
//       //         onClick={() => console.log("Add location SUBMIT")}>
//       //         Afegir
//       //       </Button>
//       //     ),
//       //   },
//       // ],
//     });
//   };

//   return () => openModal();
// };

// export const AddLocationModal = () => {
//   const updateModal = useUpdateModal();
//   const [location, setLocation] = useState<any>([]);

//   // Manejo del submit del formulario
//   const handleSubmit = async (formData: {
//     locationDescription: string;
//     cameraCode: string;
//     capturePattern: string;
//     user: string;
//     password: string;
//   }) => {
//     const {locationDescription, cameraCode, capturePattern} = formData;
//     const mediator = new Mediator();
//     try {
//       const location = await mediator.send(
//         new AddLocationCommand(
//           "CAT",
//           locationDescription,
//           cameraCode,
//           capturePattern,
//           {username: formData.user, password: formData.password}
//         )
//       );
//       console.log(location);
//     } catch (e) {
//       console.error(e.message);
//     }
//   };

//   const openModal = () => {
//     console.log("MODAL: localització");
//     updateModal({
//       title: "Afegir nova localització",
//       maxWidth: "lg",
//       closeAction: true,
//       className: "modal",
//       content: () => <AddLocation onSubmit={handleSubmit} />, // Pasa handleSubmit como prop
//     });
//   };

//   return openModal;
// };

export const AddLocationModal = () => {
  const updateModal = useUpdateModal();
  const updateModalActions = useUpdateModalActions();

  const [locationDescription, setLocationDescription] = useState<string>("");
  const [cameraCode, setCameraCode] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [capturePattern, setCapturePattern] = useState<string>("");

  const handleSubmit = async () => {
    const mediator = new Mediator();
    try {
      const location = await mediator.send(
        new AddLocationCommand(
          "CAT",
          locationDescription,
          cameraCode,
          capturePattern,
          {username: user, password}
        )
      );

      console.log(location);
    } catch (e) {
      console.error(e.message);
    }
  };

  const openModal = () => {
    updateModal({
      title: "Afegir un nova localizació",
      maxWidth: "lg",
      closeAction: true,
      className: "",
      content: () => (
        <AddLocation
          onLocationDescriptionChange={setLocationDescription}
          onCameraCodeChange={setCameraCode}
          onCapturePatternChange={setCapturePattern}
          onUserChange={setUser}
          onPasswordChange={setPassword}
        />
      ),
    });
  };
  useEffect(() => {
    if (locationDescription) {
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
  }, [locationDescription]);

  return openModal;
};
