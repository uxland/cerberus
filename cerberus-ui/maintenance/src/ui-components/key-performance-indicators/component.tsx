import {Badge, Box, Divider, SvgIcon, Typography} from '@mui/material';

export const OpenIssuesPerformanceItem = (props: {
  title: string;
  icon;
  currentSevenDays: string;
  previousSevenDays: string;
}) => {
  const CustomDivider = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}>
        <Divider
          orientation='vertical'
          variant='middle'
          color='#828282'
          className='kpi-divider'
          flexItem
        />
      </Box>
    );
  };
  return (
    <div className='flex flex-col justify-between bg-tableBg w-96 p-4 rounded-md gap-4'>
      <Typography variant='h5'>{props.title}</Typography>
      <div className='flex gap-4'>
        <SvgIcon component={() => props.icon}></SvgIcon>
        <div className='flex gap-10'>
          <Typography variant='body1'>Actuales</Typography>
          <div className='flex'>
            <Typography variant='body1'>{props.currentSevenDays}</Typography>
            <Badge>10%</Badge>
          </div>
          <CustomDivider />
          <div>
            <Typography variant='body1'>{props.previousSevenDays}</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
