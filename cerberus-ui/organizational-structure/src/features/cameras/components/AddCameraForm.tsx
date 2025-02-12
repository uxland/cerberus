import {InputField} from "@cerberus/core";
import {ChangeEvent, useState} from "react";
import {useOrganizationalStructureLocales} from "../../../locales/ca/locales.ts";
import {LocationSettings} from "../../locations/location-detail/show-location-settings/model.ts";

export const AddEditCameraForm = ( {   showCameraCode, settings, onModelChanged}: {
  showCameraCode?: boolean;
  settings: LocationSettings;
  onModelChanged: (settings: LocationSettings) => void;
}) => {
    const [formData, setFormData] = useState<{
        cameraDescription: string;
        capturePattern: string;
        cameraUrl: string;
        user: string;
        password: string;
        cameraCode: string;
        brandName?: string;
        modelName?: string;
        price?: number;
        manufactureYear?: number;
    }>({
        cameraDescription: settings?.description,
        capturePattern: settings?.adminSettings?.captureRecurrencePattern,
        cameraUrl: settings?.adminSettings?.ipAddress,
        user: settings?.adminSettings?.cameraCredentials?.username,
        password: settings?.adminSettings?.cameraCredentials?.password,
        cameraCode: settings?.id,
        brandName: settings?.brandName,
        modelName: settings?.modelName,
        price: settings?.price,
        manufactureYear: settings?.manufactureYear
    });
    const setProperty = (property: keyof typeof formData,value: any) => {
        setFormData((prev) => {
            const newData = {...prev, [property]: value};
            onModelChanged({...settings,
                id: newData.cameraCode,
                description: newData.cameraDescription,
                adminSettings: {ipAddress: newData.cameraUrl,
                    captureRecurrencePattern: newData.capturePattern,
                    cameraCredentials: {username: newData.user, password: newData.password}},
                brandName: newData.brandName,
                modelName: newData.modelName,
                price: newData.price,
                manufactureYear: newData.manufactureYear
            }
            );
            return newData;
        });

    }
  return (
    <div className="flex flex-col gap-4">
      <InputField
        title={useOrganizationalStructureLocales("addCamera.name")}
        required
        value={formData.cameraDescription}
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          setProperty("cameraDescription", ev.target.value)
        }
      />
      {showCameraCode && (
        <InputField
          title={useOrganizationalStructureLocales("addCamera.cameraCode")}
          required
            value={formData.cameraCode}
          onChange={(ev: ChangeEvent<HTMLInputElement>) =>
            setProperty("cameraCode", ev.target.value)
          }
        />
      )}
      <InputField
        title={useOrganizationalStructureLocales("addCamera.capturePattern")}
        value={formData.capturePattern}
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          setProperty("capturePattern", ev.target.value)
        }
      />
      <InputField
        title={useOrganizationalStructureLocales("addCamera.url")}
        value={formData.cameraUrl}
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          setProperty("cameraUrl", ev.target.value)
        }
      />
      <div className="flex gap-4">
      <InputField
        title={useOrganizationalStructureLocales("addCamera.brandName")}
        value={formData.brandName}
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          setProperty("brandName", ev.target.value)
        }
      />
      <InputField
        title={useOrganizationalStructureLocales("addCamera.modelName")}
        value={formData.modelName}
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          setProperty("modelName", ev.target.value)
        }
      />
      </div>
      <InputField
        title={useOrganizationalStructureLocales("addCamera.price")}
        value={formData.priceName}
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          setProperty("priceName", ev.target.value)
        }
      />
      <InputField
        title={useOrganizationalStructureLocales("addCamera.manufactureYear")}
        value={formData.manufactureYear}
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          setProperty("manufactureYear", ev.target.value)
        }
      />
      <div className="flex gap-4">
        <InputField
          title={useOrganizationalStructureLocales("addCamera.user")}
            value={formData.user}
          onChange={(ev: ChangeEvent<HTMLInputElement>) =>
            setProperty("user", ev.target.value)
          }
        />
        <InputField
          title={useOrganizationalStructureLocales("addCamera.password")}
            value={formData.password}
          onChange={(ev: ChangeEvent<HTMLInputElement>) =>
            setProperty("password", ev.target.value)
          }
        />
      </div>
    </div>
  );
};
