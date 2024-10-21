import {InputField} from "@cerberus/core";
import {ChangeEvent} from "react";
import {useOrganizationalStructureLocales} from "../../locales/ca/locales";

export const AddCamera = (props: {
  onCameraCodeChange: (value: string) => void;
  onCameraDescriptionChange: (value: string) => void;
  onCapturePatternChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onUserChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <InputField
        title={useOrganizationalStructureLocales("addCamera.name")}
        required
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          props.onCameraDescriptionChange(ev.target.value)
        }
      />
      <InputField
        title={useOrganizationalStructureLocales("addCamera.cameraCode")}
        required
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          props.onCameraCodeChange(ev.target.value)
        }
      />
      <InputField
        title={useOrganizationalStructureLocales("addCamera.capturePattern")}
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          props.onCapturePatternChange(ev.target.value)
        }
      />
      <InputField
        title={useOrganizationalStructureLocales("addCamera.url")}
        onChange={(ev: ChangeEvent<HTMLInputElement>) =>
          props.onUrlChange(ev.target.value)
        }
      />
      <div className="flex gap-4">
        <InputField
          title={useOrganizationalStructureLocales("addCamera.user")}
          onChange={(ev: ChangeEvent<HTMLInputElement>) =>
            props.onUserChange(ev.target.value)
          }
        />
        <InputField
          title={useOrganizationalStructureLocales("addCamera.password")}
          onChange={(ev: ChangeEvent<HTMLInputElement>) =>
            props.onPasswordChange(ev.target.value)
          }
        />
      </div>
    </div>
  );
};
