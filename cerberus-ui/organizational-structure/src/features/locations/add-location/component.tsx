import {useUpdateModal} from "@cerberus/core/src/providers";
import {Button} from "@mui/material";
import {ChangeEvent, useRef, useState} from "react";
import {useOrganizationalStructureLocales} from "../../../locales/ca/locales";
import {InputField} from "../../../ui-components";
export const AddLocation = () => {
  const ref = useRef(null);
  const [locationName, setLocationName] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pattern, setPattern] = useState<string>("");
  const handleLocationNameChange = (
    ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLocationName(ev.target.value);
  };
  const handleUserChange = (
    ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUser(ev.target.value);
  };
  const handlePasswordChange = (
    ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(ev.target.value);
  };
  const handlePatternChange = (
    ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPattern(ev.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <InputField
        ref={ref}
        title={useOrganizationalStructureLocales("addLocation.name")}
        value={locationName}
        onChange={handleLocationNameChange}
      />
      <InputField
        ref={ref}
        title={useOrganizationalStructureLocales("addLocation.pattern")}
        value={pattern}
        onChange={handlePatternChange}
      />
      <div className="flex gap-4">
        <InputField
          ref={ref}
          title={useOrganizationalStructureLocales("addLocation.user")}
          value={user}
          onChange={handleUserChange}
        />
        <InputField
          ref={ref}
          title={useOrganizationalStructureLocales("addLocation.password")}
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
    </div>
  );
};

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
