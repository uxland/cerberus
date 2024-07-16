import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import {Mediator} from 'mediatr-ts';
import {useEffect, useState} from 'react';
import {HierarchyItemType} from '../../../state/hierarchy-item.ts';
import {LocationSettings} from './model.ts';
import {GetLocationSettings} from './query.ts';

export const LocationSettingsView = (props: {
  id: string;
  type: HierarchyItemType;
}) => {
  const [settings, setSettings] = useState<LocationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const settings = await new Mediator().send(
          new GetLocationSettings(props.id, props.type)
        );
        setSettings(settings);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData().then(() => console.log('done'));
  }, [props]);
  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {settings && LocationSettingsComponent(settings)}
    </div>
  );
};

const LocationSettingsComponent = (settings: LocationSettings) => {
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
