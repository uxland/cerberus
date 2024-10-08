import {TextField, Typography} from "@mui/material";
import {ChangeEvent, useRef, useState} from "react";
import {useOrganizationalStructureLocales} from "../../../locales/ca/locales";
export const AddLocation = () => {
  const ref = useRef(null);
  const [locationName, setLocationName] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
    setPassword(ev.target.value);
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
        value={password}
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

const InputField = (props: {
  ref: any;
  title: string;
  value: string;
  onChange: any;
}) => {
  return (
    <div className="flex flex-col flex-1 gap-2">
      <Typography variant="body1">{props.title}</Typography>
      <TextField
        ref={props.ref}
        value={props.value}
        onChange={props.onChange}
        // placeholder={`${useOrganizationalStructureLocales(
        //   "addLocation.placeholder"
        // )} ${props.value}`}
        sx={{
          width: "100%",
          height: "50px",
          backgroundColor: "#313131",
          color: "#d7dadb",
          borderRadius: "6px",
          border: "1px solid #707070",
          "&:focus": {
            borderColor: "#707070 !important",
            outline: "none !important",
            boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.25)",
          },
        }}
      />
    </div>
  );
};
