import * as colors from '@mui/material/colors';
import {Config} from 'tailwindcss';
//MUI palette replace tailwind palette

const config: Config = {
  content: ['../*/src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      fontFamily: {
        body: ['"Roboto"', '"Open Sans"'],
      },
      colors: {
        ...colors,
        primary: '#5DBB63',
        neutral: '#F5F5F5',
      },
    },
  },

  plugins: [],
};
export default config;
