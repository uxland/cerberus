import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
export const NoData = () => {
  return (
    <TableRow style={{height: '100%'}}>
      <TableCell
        colSpan={8}
        align='center'
        sx={{position: 'relative', height: '500px'}}>
        <div
          className='flex items-center justify-center'
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#1f1f1f',
          }}>
          <div className='flex flex-col items-center gap-2'>
            <WarningOutlinedIcon color='primary' />
            <Typography variant='body1' color='white'>
              No data
            </Typography>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
