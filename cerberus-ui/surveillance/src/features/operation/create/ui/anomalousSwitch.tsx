import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';

const AnomalousSwitch = styled(Switch)(({ theme }) => ({
    width: 58,
    height: 32,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 3,
        padding: 0,
        transform: 'translateX(4px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(24px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#d32f2f',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: '#686868',
        width: 26,
        height: 26,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#cccccc',
        borderRadius: 20,
    },
}));

export default AnomalousSwitch;