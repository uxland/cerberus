import blueGrey from '@mui/material/colors/blueGrey';
import createTheme from '@mui/material/styles/createTheme';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfigModule from '../../../tailwind.config';

const tailwindConfig = resolveConfig(tailwindConfigModule);

const paletteTheme = createTheme({
  palette: {
    primary: {
      main: `${tailwindConfig.theme.colors.primary}`,
    },
  },
});

const theme = createTheme(paletteTheme, {
  typography: {
    htmlFontSize: 14,
    fontFamily: 'Roboto',
    h1: {
      fontSize: createTheme().typography.pxToRem(28),
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '900',
      color: `${paletteTheme.palette.primary.main}`,
    },
    h2: {
      fontSize: createTheme().typography.pxToRem(16),
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '500',
      color: 'black',
    },
    h3: {
      fontSize: createTheme().typography.pxToRem(14),
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '500',
      color: 'black',
    },
    h4: {
      fontSize: createTheme().typography.pxToRem(14),
      color: blueGrey[900],
      textTransform: 'uppercase',
      letterSpacing: '.5px',
      fontWeight: '500',
    },
    h5: {
      fontSize: createTheme().typography.pxToRem(12),
      color: blueGrey[900],
      textTransform: 'uppercase',
      letterSpacing: '.5px',
      fontWeight: '500',
    },
    subtitle1: {
      fontSize: createTheme().typography.pxToRem(16),
      fontWeight: '500',
      lineHeight: '21px',
      color: blueGrey[900],
    },
    body1: {
      fontSize: createTheme().typography.pxToRem(14),
      color: blueGrey[300],
    },
  },
});

export default theme;
