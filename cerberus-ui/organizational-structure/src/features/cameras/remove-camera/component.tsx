import {useUpdateModal} from "@cerberus/core/src/providers";
import {Button} from "@mui/material";
import {useOrganizationalStructureLocales} from "../../../locales/ca/locales";
import {DeleteCamera} from "./command";
import {Mediator} from "mediatr-ts";
import {notificationService} from "@cerberus/core";

export const RemoveCameraModal = (id: string, name: string) => {
  const updateModal = useUpdateModal();

  const successMessage: string = useOrganizationalStructureLocales(
    "removeCamera.notifcation.success"
  );
  const errorMessage: string = useOrganizationalStructureLocales(
    "removeCamera.notifcation.error"
  );

  const handleSubmit = async () => {
    const mediator = new Mediator();
    try {
      await mediator.send(new DeleteCamera(id));
      notificationService.notifySuccess(successMessage);
    } catch (e) {
      notificationService.notifyError(errorMessage, e.message);
      console.error(e.message);
    }
    updateModal(null);
  };

  const openModal = () => {
    updateModal({
      title: "Estàs segur que vols eliminar aquesta càmera?",
      maxWidth: "lg",
      closeAction: true,
      className: "",
      content: () => (
        <div className="flex flex-col justify-center items-center gap-4">
          <h1>Camerà {name}</h1>
          <div className="flex gap-4">
            <Button onClick={handleSubmit}>Si</Button>
            <Button onClick={() => updateModal(null)}>No</Button>
          </div>
        </div>
      ),
    });
  };

  return openModal;
};