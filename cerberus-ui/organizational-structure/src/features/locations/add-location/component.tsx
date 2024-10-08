import {useUpdateModal} from "@cerberus/core/src/providers";
import {Button} from "@mui/material";
import {AddLocation} from "../../../ui-components/add-location/component";

export const AddLocationModal = () => {
  const updateModal = useUpdateModal();
  const openModal = () => {
    console.log("MODAL: localització");
    updateModal({
      title: "Afegir nova localització",
      maxWidth: "lg",
      closeAction: true,
      className: "modal",
      content: AddLocation,
      actions: [
        {
          id: "0",
          sort: 1,
          content: () => (
            <Button
              variant="contained"
              size="small"
              color="success"
              fullWidth
              className="!rounded-2xl !w-52 !text-white !bg-[#02bc77]"
              onClick={() => console.log("Add location SUBMIT")}>
              Afegir
            </Button>
          ),
        },
      ],
    });
  };

  return () => openModal();
};
