import {ChangeEvent, useState} from "react";
import {useOrganizationalStructureLocales} from "../../locales/ca/locales";
import {InputField} from "../input-field/component";

export const AddCamera = () => {
  const [locationName, setLocationName] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const handleCameraNameChange = (
    ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLocationName(ev.target.value);
  };
  const handleUrlChange = (
    ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUrl(ev.target.value);
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

  return (
    <div className="flex flex-col gap-4">
      <InputField
        title={useOrganizationalStructureLocales("addCamera.name")}
        value={locationName}
        onChange={handleCameraNameChange}
        required
      />
      <InputField
        title={useOrganizationalStructureLocales("addCamera.url")}
        value={url}
        onChange={handleUrlChange}
        required
      />
      <div className="flex gap-4">
        <InputField
          title={useOrganizationalStructureLocales("addCamera.user")}
          value={user}
          onChange={handleUserChange}
        />
        <InputField
          title={useOrganizationalStructureLocales("addCamera.password")}
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
    </div>
  );
};
