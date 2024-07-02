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
        secondary: '#828282',
        neutral: '#F5F5F5',
        text: {
          primaryGrey: '#121212',
        },
      },
    },
  },

  plugins: [],
};
export default config;
