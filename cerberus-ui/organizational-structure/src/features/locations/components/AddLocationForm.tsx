import {InputField} from "@cerberus/core";
import {ChangeEvent, useState} from "react";
import {useOrganizationalStructureLocales} from "../../../locales/ca/locales.ts";
import {LocationSettings} from "../location-detail/show-location-settings/model.ts";

export const AddEditLocationForm = ({showCameraCode, settings, onModelChanged}: {
  showCameraCode?: boolean;
    settings: LocationSettings | undefined;
    onModelChanged: (settings: LocationSettings) => void;
}) => {
    const [formData, setFormData] = useState<{
        locationDescription: string;
        capturePattern: string;
        cameraUrl: string;
        user: string;
        password: string;
        locationCode: string;
    }>({
        locationDescription: settings?.description,
        capturePattern: settings?.adminSettings?.captureRecurrencePattern,
        cameraUrl: settings?.adminSettings?.ipAddress,
        user: settings?.adminSettings?.cameraCredentials?.username,
        password: settings?.adminSettings?.cameraCredentials?.password,
        locationCode: settings?.id
    });
    const setProperty = (property: keyof typeof formData,value: any) => {
        const newData = {...formData, [property]: value};
        setFormData(newData);
        onModelChanged({...settings, id: newData.locationCode, description: newData.locationDescription, adminSettings: {ipAddress: newData.cameraUrl, captureRecurrencePattern: newData.capturePattern, cameraCredentials: {username: newData.user, password: newData.password}}});
    }
    return (
    <div className="flex flex-col gap-4">
      <InputField
        title={useOrganizationalStructureLocales("addLocation.description")}
        required
        value={formData.locationDescription}
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          setProperty("locationDescription", ev.target.value)
        }
      />
      {showCameraCode && (
        <InputField
            value={formData.locationCode}
          title={useOrganizationalStructureLocales("addLocation.locationCode")}
          onChange={(ev: ChangeEvent<HTMLInputElement>) =>
            setProperty("locationCode", ev.target.value)
          }
        />
      )}
      <InputField
        value={formData.capturePattern}
        title={useOrganizationalStructureLocales("addLocation.capturePattern")}
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          setProperty('capturePattern', ev.target.value)
        }
      />
      <div className="flex gap-4">
        <InputField
            value={formData.user}
          title={useOrganizationalStructureLocales("addLocation.user")}
          onChange={(ev: ChangeEvent<HTMLInputElement>) =>
            setProperty("user", ev.target.value)
          }
        />
        <InputField
            value={formData.password}
          title={useOrganizationalStructureLocales("addLocation.password")}
          onChange={(ev: ChangeEvent<HTMLInputElement>) =>
              setProperty("password", ev.target.value)
          }
        />
      </div>
    </div>
  );
};
