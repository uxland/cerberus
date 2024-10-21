import {useUpdateModal} from "@cerberus/core/src/providers";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from "@mui/material";
import TableHead from "@mui/material/TableHead";
import {LocationSettings} from "../../../locations/location-detail/show-location-settings/model";
import {AddCameraModal} from "../../add-camera/component";
export const CameraSettings = (settings: LocationSettings) => {
  const items = [
    {key: "ID", value: settings?.id},
    {key: "Description", value: settings?.description},
    {key: "Address", value: settings?.adminSettings?.ipAddress},
    {
      key: "Capture pattern",
      value: settings?.adminSettings?.captureRecurrencePattern,
    },
    {
      key: "User name",
      value: settings?.adminSettings?.cameraCredentials?.username,
    },
    {
      key: "Password",
      value: settings?.adminSettings?.cameraCredentials?.password,
    },
  ];

  console.log(settings);

  const updateModal = useUpdateModal();

  const openModal = () => {
    return AddCameraModal;
    // updateModal({
    //   title: "Editar paràmetres de la càmera",
    //   content: (
    //     <AddCamera
    //       onCameraCodeChange={function (value: string): void {
    //         throw new Error("Function not implemented.");
    //       }}
    //       onCameraDescriptionChange={function (value: string): void {
    //         throw new Error("Function not implemented.");
    //       }}
    //       onCapturePatternChange={function (value: string): void {
    //         throw new Error("Function not implemented.");
    //       }}
    //       onUrlChange={function (value: string): void {
    //         throw new Error("Function not implemented.");
    //       }}
    //       onUserChange={function (value: string): void {
    //         throw new Error("Function not implemented.");
    //       }}
    //       onPasswordChange={function (value: string): void {
    //         throw new Error("Function not implemented.");
    //       }}
    //     />
    //   ),
    // });
  };

  return (
    <div className="flex flex-col gap-8 w-[520px]">
      <Button onClick={openModal}>TEST</Button>

      <TableContainer component={Paper} className="flex-1">
        <Table className="custom-table bg-tableBg">
          <TableHead className="flex flex-1 !w-full !justify-end bg-tableBg">
            <Tooltip title={"Editar"}>
              <IconButton color="primary">
                <ModeEditOutlineIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={"Esborrar"}>
              <IconButton color="error">
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </TableHead>
          <TableBody>
            {items.map(({key, value}, index) => (
              <TableRow key={index}>
                <TableCell className="!font-semibold">{key}</TableCell>
                <TableCell>{value ? value : "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
