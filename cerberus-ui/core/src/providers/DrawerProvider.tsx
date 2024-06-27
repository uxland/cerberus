import {ReactElement, createContext, useContext, useState} from 'react';

export type DrawerProviderState = {
  content: React.FC | null;
  open?: boolean;
  anchor?: 'bottom' | 'left' | 'right' | 'top';
  widht?: string;
};

type SetDrawer = (config: DrawerProviderState) => void;
const DrawerStateContext = createContext<DrawerProviderState | undefined>(
  undefined
);

const DrawerDispatchContext = createContext<SetDrawer | undefined>(undefined);

export const DrawerProvider = ({children}: {children: ReactElement}) => {
  const [drawer, SetDrawer] = useState<DrawerProviderState>({
    content: null,
    open: true,
    anchor: 'left',
    widht: '20vw',
  });

  return (
    <DrawerStateContext.Provider value={drawer}>
      <DrawerDispatchContext.Provider value={SetDrawer}>
        {children}
      </DrawerDispatchContext.Provider>
    </DrawerStateContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerStateContext);
  if (context === undefined) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};

export const useUpdateDrawer = () => {
  const context = useContext(DrawerDispatchContext);
  if (context === undefined) {
    throw new Error('useUpdateDrawer must be used within a DrawerProvider');
  }
  return context;
};
