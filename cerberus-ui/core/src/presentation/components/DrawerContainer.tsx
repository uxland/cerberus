import {Box, Typography} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Logo from '../../../../app/src/assets/instrumenta.png';
import {useDrawer} from '../../providers/DrawerProvider';
const renderContent = (Content: React.FC) => <Content />;

export const DrawerContainer = () => {
  const config = useDrawer();

  return (
    <Drawer
      PaperProps={{sx: {width: config?.widht ? config.widht : '20vw'}}}
      anchor={config.anchor}
      variant='permanent'>
      <Box color={'CaptionText'} gap={4}>
        <div className='flex flex-col gap-2'>
          <div className='h-22 p-4'>
            <img src={Logo} />
          </div>
          <div className='flex p-6 bg-[#202020] justify-between'>
            <div className='flex flex-col items-start p-1'>
              <Typography variant='h3'>115</Typography>
              <Typography variant='body1'>Alertas Activas</Typography>
            </div>
          </div>
        </div>
        <div className='h-full '>
          {config?.content && renderContent(config?.content)}
        </div>
      </Box>
    </Drawer>
  );
};
