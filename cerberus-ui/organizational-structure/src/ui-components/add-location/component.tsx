import {ChangeEvent} from "react";
import {useOrganizationalStructureLocales} from "../../locales/ca/locales";
import {InputField} from "../input-field/component";

export const AddLocation = (props: {
  onLocationDescriptionChange: (value: string) => void;
  onLocationCodeChange: (value: string) => void;
  onCapturePatternChange: (value: string) => void;
  onUserChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}) => {
  const {
    onLocationDescriptionChange,
    onLocationCodeChange,
    onCapturePatternChange,
    onUserChange,
    onPasswordChange,
  } = props;

  return (
    <div className="flex flex-col gap-4">
      <InputField
        title={useOrganizationalStructureLocales("addLocation.description")}
        required
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          onLocationDescriptionChange(ev.target.value)
        }
      />
      <InputField
        title={useOrganizationalStructureLocales("addLocation.locationCode")}
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          onLocationCodeChange(ev.target.value)
        }
      />
      <InputField
        title={useOrganizationalStructureLocales("addLocation.capturePattern")}
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          onCapturePatternChange(ev.target.value)
        }
      />
      <div className="flex gap-4">
        <InputField
          title={useOrganizationalStructureLocales("addLocation.user")}
          onChange={(ev: ChangeEvent<HTMLInputElement>) =>
            onUserChange(ev.target.value)
          }
        />
        <InputField
          title={useOrganizationalStructureLocales("addLocation.password")}
          onChange={(ev: ChangeEvent<HTMLInputElement>) =>
            onPasswordChange(ev.target.value)
          }
        />
      </div>
    </div>
  );
};
