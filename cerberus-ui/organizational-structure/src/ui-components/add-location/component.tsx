import {ChangeEvent, useRef, useState} from "react";
import {useOrganizationalStructureLocales} from "../../locales/ca/locales";
import {InputField} from "../input-field/component";

export const AddLocation = (props: {
  onLocationDescriptionChange: (value: string) => void;
  onCameraCodeChange: (value: string) => void;
  onCapturePatternChange: (value: string) => void;
  onUserChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}) => {
  const {
    onLocationDescriptionChange,
    onCameraCodeChange,
    onCapturePatternChange,
    onUserChange,
    onPasswordChange,
  } = props;

  const [locationDescription, setLocationDescription] = useState<string>("");
  const [cameraCode, setCameraCode] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [capturePattern, setCapturePattern] = useState<string>("");

  const ref = useRef(null);

  return (
    <div className="flex flex-col gap-4">
      <InputField
        ref={ref}
        title={useOrganizationalStructureLocales("addLocation.description")}
        value={locationDescription}
        onChange={(ev: ChangeEvent<HTMLInputElement>) => {
          const value = ev.target.value;
          setLocationDescription(value);
          onLocationDescriptionChange(value);
        }}
      />
      <InputField
        ref={ref}
        title={useOrganizationalStructureLocales("addLocation.cameraCode")}
        value={cameraCode}
        onChange={(ev: ChangeEvent<HTMLInputElement>) => {
          const value = ev.target.value;
          setCameraCode(value);
          onCameraCodeChange(value);
        }}
      />
      <InputField
        ref={ref}
        title={useOrganizationalStructureLocales("addLocation.capturePattern")}
        value={capturePattern}
        onChange={(ev: ChangeEvent<HTMLInputElement>) => {
          const value = ev.target.value;
          setCapturePattern(value);
          onCapturePatternChange(value);
        }}
      />
      <div className="flex gap-4">
        <InputField
          ref={ref}
          title={useOrganizationalStructureLocales("addLocation.user")}
          value={user}
          onChange={(ev: ChangeEvent<HTMLInputElement>) => {
            const value = ev.target.value;
            setUser(value);
            onUserChange(value);
          }}
        />
        <InputField
          ref={ref}
          title={useOrganizationalStructureLocales("addLocation.password")}
          value={password}
          onChange={(ev: ChangeEvent<HTMLInputElement>) => {
            const value = ev.target.value;
            setPassword(value);
            onPasswordChange(value);
          }}
        />
      </div>
    </div>
  );
};
// export const AddLocation = ({
//   onSubmit,
// }: {
//   onSubmit: (formData: any) => void;
// }) => {
//   const [locationDescription, setLocationDescription] = useState<string>("");
//   const [cameraCode, setCameraCode] = useState<string>("");
//   const [user, setUser] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [capturePattern, setCapturePattern] = useState<string>("");
//   const ref = useRef(null);
//   const handleSubmit = () => {
//     onSubmit({
//       locationDescription,
//       cameraCode,
//       user,
//       password,
//       capturePattern,
//     });
//   };

//   return (
//     <div className="flex flex-col gap-4">
//       <InputField
//         ref={ref}
//         title={useOrganizationalStructureLocales("addLocation.description")}
//         value={locationDescription}
//         onChange={(ev: ChangeEvent<HTMLInputElement>) =>
//           setLocationDescription(ev.target.value)
//         }
//       />
//       <InputField
//         ref={ref}
//         title={useOrganizationalStructureLocales("addLocation.capturePattern")}
//         value={cameraCode}
//         onChange={(ev: ChangeEvent<HTMLInputElement>) =>
//           setCameraCode(ev.target.value)
//         }
//       />
//       <InputField
//         ref={ref}
//         title={useOrganizationalStructureLocales("addLocation.capturePattern")}
//         value={capturePattern}
//         onChange={(ev: ChangeEvent<HTMLInputElement>) =>
//           setCapturePattern(ev.target.value)
//         }
//       />
//       <div className="flex gap-4">
//         <InputField
//           ref={ref}
//           title={useOrganizationalStructureLocales("addLocation.user")}
//           value={user}
//           onChange={(ev: ChangeEvent<HTMLInputElement>) =>
//             setUser(ev.target.value)
//           }
//         />
//         <InputField
//           ref={ref}
//           title={useOrganizationalStructureLocales("addLocation.password")}
//           value={password}
//           onChange={(ev: ChangeEvent<HTMLInputElement>) =>
//             setPassword(ev.target.value)
//           }
//         />
//       </div>
//       <Button
//         variant="contained"
//         size="small"
//         color="success"
//         fullWidth
//         className="!rounded-2xl !w-52 !text-white !bg-[#02bc77]"
//         onClick={handleSubmit}>
//         {useOrganizationalStructureLocales("addLocation.submitBtn")}
//       </Button>
//     </div>
//   );
// };
