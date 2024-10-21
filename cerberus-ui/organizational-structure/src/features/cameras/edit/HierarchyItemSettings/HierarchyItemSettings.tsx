import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {LocationSettings} from "../../../locations/location-detail/show-location-settings/model";

export const HierarchyItemSettings = (settings: LocationSettings) => {
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

  return (
    <div className="flex flex-col gap-8 w-[520px]">
      <TableContainer component={Paper} className="flex-1">
        <Table className="custom-table bg-tableBg">
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
