import {useRouter} from '@cerberus/core/src/providers/';
import {Navigate, Route, Routes} from 'react-router-dom';

import {BASE_ROUTE} from './routes';

const renderRoute = (path: string, Element: React.FC) => (
  <Route key={path} path={path} element={<Element />} />
);

//Build d'un modul concret: modificar la ruta base perque aquesta redirigueixi
//a la pagina principal del modul que es vol buildejar. També s'ha de modificiar
//el path al routes.ts del modul

export const AppRouter = () => {
  const config = useRouter();

  return (
    <Routes>
      <Route path={BASE_ROUTE} element={<div>Hola</div>} />;
      {config?.routes?.map((r) => renderRoute(r.path, r.element))}
      {/* 👇️ only match this when no other routes match */}
      <Route path='*' element={<Navigate to={BASE_ROUTE} replace />} />
    </Routes>
  );
};
