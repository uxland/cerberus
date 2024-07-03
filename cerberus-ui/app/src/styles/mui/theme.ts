import createTheme from '@mui/material/styles/createTheme';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfigModule from '../../../tailwind.config';

const tailwindConfig = resolveConfig(tailwindConfigModule);

const paletteTheme = createTheme({
  palette: {
    primary: {
      main: `${tailwindConfig.theme.colors.primary}`,
    },
    secondary: {
      main: `${tailwindConfig.theme.colors.secondary}`,
    },
    success: {main: `${tailwindConfig.theme.colors.success}`},
    info: {main: `${tailwindConfig.theme.colors.info}`},
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
      fontWeight: '800',
      color: `${paletteTheme.palette.primary.main}`,
    },
    h2: {
      fontSize: createTheme().typography.pxToRem(24),
      fontFamily: 'Montserrat',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '500',
      color: `${tailwindConfig.theme.colors.black}`,
    },
    h3: {
      fontSize: createTheme().typography.pxToRem(20),
      fontFamily: 'Montserrat',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '400',
      color: `${tailwindConfig.theme.colors.white}`,
    },
    h4: {
      fontSize: createTheme().typography.pxToRem(18),
      fontFamily: 'Montserrat',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '400',
      color: `${tailwindConfig.theme.colors.white}`,
    },
    h5: {
      fontSize: createTheme().typography.pxToRem(16),
      fontFamily: 'Montserrat',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '400',
      color: `${tailwindConfig.theme.colors.white}`,
    },
    body1: {
      fontSize: createTheme().typography.pxToRem(14),
      fontFamily: 'Montserrat',
      fontWeight: '400',

      color: `${tailwindConfig.theme.colors.white}`,
    },
  },
  components: {
    MuiTreeItem: {
      styleOverrides: {
        root: {
          textAlign: 'left',
          color: `${tailwindConfig.theme.colors.white}`,
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

          '&.kpi-divider': {
            height: '2rem',
            top: '-10px',
          },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          fontWeight: '800 !important',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: '800 !important',
          '&.capture-btn': {
            fontSize: '14px',
            color: '#4791ff',
            borderColor: '#4791ff',
            borderRadius: '50px',
            border: '2px solid',
            width: '200px',
            height: '34px',
            position: 'relative',
            top: '-.6rem',
          },
          '&.submit-btn': {
            height: '2.2rem',
            marginBottom: '.55rem',
            '&.Mui-disabled': {
              color: `${tailwindConfig.theme.colors.white}`,
              backgroundColor: '#ccc',
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': {
            borderColor: `${tailwindConfig.theme.colors.white}`,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: `${tailwindConfig.theme.colors.white}`,
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          textAlign: 'left',
          width: '24px !important',
          height: '24px !important',

          '&.kpi-icon': {
            width: '50px !important',
            height: '50px !important',
          },
          '&.success': {
            color: `${tailwindConfig.theme.colors.success}`,
          },
          '&.error': {
            color: `${tailwindConfig.theme.colors.error}`,
          },
          '&.warning': {
            color: `${tailwindConfig.theme.colors.warning}`,
          },
          '&.info': {
            color: `${tailwindConfig.theme.colors.info}`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: `${tailwindConfig.theme.colors.black}`,
          '&.table': {
            backgroundColor: `${tailwindConfig.theme.colors.tableBg}`,
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        root: {
          fontSize: createTheme().typography.pxToRem(11),
          marginRight: '-12px',
          minHeight: '16px',
          height: '16px',
          minWidth: '16px',
          width: '16px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          height: '50px',
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${tailwindConfig.theme.colors.grey82}`,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          height: '2rem',
          fontFamily: 'Montserrat',
          color: `${tailwindConfig.theme.colors.white}`,
          fontWeight: '200',
          textAlign: 'left',
          letterSpacing: '1px',
          borderBottom: 'none',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
          width: 'auto',
          '&.table-head': {
            fontWeight: '400 !important',
            cursor: 'default',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          maxWidth: '200px',
        },
      },
    },
  },
});

export default theme;
