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
    fontFamily: 'Montserrat',
    h1: {
      fontSize: createTheme().typography.pxToRem(28),
      fontFamily: 'Montserrat',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '900',
      color: `${paletteTheme.palette.primary.main}`,
    },
    h2: {
      fontSize: createTheme().typography.pxToRem(24),
      fontFamily: 'Montserrat',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '500',
      color: 'black',
    },
    h3: {
      fontSize: createTheme().typography.pxToRem(20),
      fontFamily: 'Montserrat',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '800',
      color: 'white',
    },
    body1: {
      fontSize: createTheme().typography.pxToRem(14),
      fontFamily: 'Montserrat',
      color: 'white',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#000',
        },
      },
    },
    MuiTreeItem: {
      styleOverrides: {
        root: {
          textAlign: 'left',
          color: 'white',
        },
        label: {
          fontSize: '1rem',
          letterSpacing: '0.12',
          lineheight: '1.50px',
          fontWeight: '600 !important',
          color: '000',
          '&:hover': {
            color: `${paletteTheme.palette.primary.main}`,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#828282',
          '&.Mui-selected': {
            color: `${paletteTheme.palette.primary.main}`,
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          display: 'flex',
          alignItems: 'center',
          height: '1.2rem',
          position: 'relative',
          top: '.4rem',
          borderWidth: '.1rem',
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          fontWeight: '800 !important',
          color: 'red',
          '& .Mui-selected': {
            color: 'red',
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          textAlign: 'left',
          width: '1.5rem !important',
          height: '1.5rem !important',
        },
      },
    },
  },
});

export default theme;
