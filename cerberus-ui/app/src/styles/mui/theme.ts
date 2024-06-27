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
      fontSize: createTheme().typography.pxToRem(24),
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '500',
      color: 'black',
    },
    h3: {
      fontSize: createTheme().typography.pxToRem(20),
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '800',
      color: 'white',
    },
    body1: {
      fontSize: createTheme().typography.pxToRem(14),
      color: 'white',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#121212',
        },
      },
    },
  },
});

export default theme;
