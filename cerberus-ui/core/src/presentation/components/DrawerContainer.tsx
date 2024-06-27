import Drawer from '@mui/material/Drawer';
import {useDrawer} from '../../providers/DrawerProvider';

const renderContent = (Content: React.FC) => <Content />;

export const DrawerContainer = () => {
  const config = useDrawer();

  return (
    <Drawer
      PaperProps={{sx: {width: config?.widht ? config.widht : '20vw'}}}
      anchor={config.anchor}
      variant='permanent'>
      {config?.content && renderContent(config?.content)}
    </Drawer>
  );
};
