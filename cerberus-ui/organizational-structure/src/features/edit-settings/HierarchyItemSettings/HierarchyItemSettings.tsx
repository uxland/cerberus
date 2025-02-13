import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { LocationSettings } from "../../locations/location-detail/show-location-settings/model.ts";

export const HierarchyItemSettings = (settings: LocationSettings) => {
  const items = [
    { key: "ID", value: settings?.id },
    { key: "Descripción", value: settings?.description },
    { key: "Dirección", value: settings?.adminSettings?.ipAddress },
    {
      key: "Patrón de captura",
      value: settings?.adminSettings?.captureRecurrencePattern,
    },
    {
      key: "Nombre de usuario",
      value: settings?.adminSettings?.cameraCredentials?.username,
    },
    {
      key: "Contraseña",
      value: settings?.adminSettings?.cameraCredentials?.password,
    },
    {
      key: "Marca",
      value: settings?.brandName
    },
    {
      key: "Modelo",
      value: settings?.modelName
    },
    {
      key: "Precio",
      value: settings?.price
    },
    {
      key: "Año de Fabricación",
      value: settings?.manufactureYear
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-[520px]">
      <TableContainer component={Paper} className="flex-1">
        <Table className="custom-table bg-tableBg">
          <TableBody>
            {items.map(({ key, value }, index) => (
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