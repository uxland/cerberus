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
            height: '3rem',
            top: '-8px',
          },
          '&.training-kpi-divider': {
            height: '5.8rem',
            top: '-8px',
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
          '&.image-icon': {
            width: '80px !important',
            height: '80px !important',
          },
          '&.image-icon-small': {
            width: '25px !important',
            height: '25px !important',
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
          '&.custom-table': {
            backgroundColor: `${tailwindConfig.theme.colors.tableBg} !important`,
            borderRadius: '10px !important',
            boxShadow: 'none',
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
    MuiToggleButton: {
      styleOverrides: {
        root: {
          width: '100px !important',
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
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          alignItems: 'flex-start',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                backgroundColor: '#2ECA45',
                opacity: 1,
                border: 0,
              },
              '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
              },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
              color: '#33cf4d',
              border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
              color: 'red !important',
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.3,
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
          },
          '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: '#39393D',
            opacity: 1,
          },
        },
      },
    },
  },
});

export default theme;
