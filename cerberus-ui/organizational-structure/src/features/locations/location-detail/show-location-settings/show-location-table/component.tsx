import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import {LocationSettings} from '../model';

export const LocationSettingsTable = (settings: LocationSettings) => {
  const items = [
    {key: 'ID', value: settings?.id},
    {key: 'Description', value: settings?.description},
    {key: 'Address', value: settings?.adminSettings?.ipAddress},
    {
      key: 'Capture pattern',
      value: settings?.adminSettings?.captureRecurrencePattern,
    },
    {
      key: 'User name',
      value: settings?.adminSettings?.cameraCredentials?.username,
    },
    {
      key: 'Password',
      value: settings?.adminSettings?.cameraCredentials?.password,
    },
  ];
  return (
    <TableContainer component={Paper} className='!w-[520px]'>
      <Table className='custom-table'>
        <TableBody>
          {items.map(({key, value}, index) => (
            <TableRow
              key={index}
              style={{
                backgroundColor: index % 2 === 0 ? '#1f1f1f' : '#121212',
              }}>
              <TableCell className='!font-semibold'>{key}</TableCell>
              <TableCell>{value ? value : 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
