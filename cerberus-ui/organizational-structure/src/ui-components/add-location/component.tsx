import {ChangeEvent, useRef, useState} from "react";
import {useOrganizationalStructureLocales} from "../../locales/ca/locales";
import {InputField} from "../input-field/component";

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
