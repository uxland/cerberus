import * as colors from '@mui/material/colors';
import {Config} from 'tailwindcss';
//MUI palette replace tailwind palette

const config: Config = {
  content: ['../*/src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      fontFamily: {
        body: ['Montserrat', 'Open Sans'],
      },
      colors: {
        ...colors,
        primary: '#ffc200',
        secondary: '#02bc77',
        success: '#02bc77',
        info: '#4791ff',
        error: '#FF2366',
        warning: '#ffd950',
        neutral: '#F5F5F5',
        white: '#fff',
        black: '#000',
        primaryGrey: '#121212',
        grey82: '#828282',
        tableBg: '#1f1f1f',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '2100px',
    },
  },

  plugins: [],
};
export default config;
