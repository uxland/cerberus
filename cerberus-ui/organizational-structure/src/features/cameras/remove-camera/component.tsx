// import { useUpdateModal } from "@cerberus/core/src/providers";
// import { Button } from "@mui/material";
// import { DeleteCamera } from "./command";
// import { Mediator } from "mediatr-ts";

// export const RemoveCameraModal = (id: string, description: string) => {
//   const updateModal = useUpdateModal();

//   const handleSubmit = async () => {
//     const mediator = new Mediator();
//     await mediator.send(new DeleteCamera(id, description ));
//     updateModal(null);
//   };

//   const openModal = () => {
//     updateModal({
//       title: "Estàs segur que vols eliminar aquesta càmera?",
//       maxWidth: "lg",
//       closeAction: true,
//       className: "",
//       content: () => (
//         <div className="flex flex-col justify-center items-center gap-4">
//           <h1>Camerà {description}</h1>
//           <div className="flex gap-4">
//             <Button onClick={handleSubmit}>Si</Button>
//             <Button onClick={() => updateModal(null)}>No</Button>
//           </div>
//         </div>
//       ),
//     });
//   };

//   return openModal;
// };