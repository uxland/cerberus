import {createContext, useContext, useState} from 'react';
import {Route} from '../../domain/routes';
import {contextNameBuilder} from '../constants';

type RouterProviderState = {routes: Route[]};
type SetRoutes = (routes: Route[]) => void;

const RouterStateContext = createContext<RouterProviderState | undefined>(
  undefined
);
RouterStateContext.displayName = contextNameBuilder('router-state');
const RouterDispatchContext = createContext<SetRoutes | undefined>(undefined);
RouterDispatchContext.displayName = contextNameBuilder('router-dispatch');

export const RouterProvider = ({children}) => {
  const [routes, setRoutes] = useState<RouterProviderState>({routes: []});
  const customSetRoutes = (newRoutes: Route[]) => {
    const finalRoutes = {
      ...routes,
      routes: routes.routes.concat(newRoutes),
    };
    setRoutes(finalRoutes);
  };

  return (
    <RouterStateContext.Provider value={routes}>
      <RouterDispatchContext.Provider value={customSetRoutes}>
        {children}
      </RouterDispatchContext.Provider>
    </RouterStateContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterStateContext);
  if (context === undefined) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

export const useUpdateRouter = () => {
  const context = useContext(RouterDispatchContext);
  if (context === undefined) {
    throw new Error('useUpdateRouter must be used within a RouterProvider');
  }
  return context;
};
