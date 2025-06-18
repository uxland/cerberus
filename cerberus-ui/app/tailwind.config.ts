import * as colors from '@mui/material/colors';
import { Config } from 'tailwindcss';
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
        formSelect: '#fed950',
        formSelectHover: '#fdd033',
        secondaryHover: '#02a365',
      },
      // Animaciones y Keyframes (solo lo usa el componente cron-builder ahora mismo)
      animation: {
        'in': 'fadeIn 200ms ease-out',
        'out': 'fadeOut 200ms ease-in',
        'fade-in': 'fadeIn 200ms ease-out',
        'fade-out': 'fadeOut 200ms ease-in',
        'zoom-in-95': 'zoomIn95 200ms ease-out',
        'zoom-out-95': 'zoomOut95 200ms ease-in',
        'slide-in-from-top': 'slideInFromTop 200ms ease-out',
        'slide-in-from-bottom': 'slideInFromBottom 200ms ease-out',
        'slide-in-from-left': 'slideInFromLeft 200ms ease-out',
        'slide-in-from-right': 'slideInFromRight 200ms ease-out',
        'slide-out-to-top': 'slideOutToTop 200ms ease-in',
        'slide-out-to-bottom': 'slideOutToBottom 200ms ease-in',
        'slide-out-to-left': 'slideOutToLeft 200ms ease-in',
        'slide-out-to-right': 'slideOutToRight 200ms ease-in',
        'slide-in-from-top-2': 'slideInFromTop2 200ms ease-out',
        'slide-in-from-bottom-2': 'slideInFromBottom2 200ms ease-out',
        'slide-in-from-left-2': 'slideInFromLeft2 200ms ease-out',
        'slide-in-from-right-2': 'slideInFromRight2 200ms ease-out',
        'slide-in-from-left-1/2': 'slideInFromLeftHalf 200ms ease-out',
        'slide-in-from-top-48%': 'slideInFromTop48 200ms ease-out',
        'slide-out-to-left-1/2': 'slideOutToLeftHalf 200ms ease-in',
        'slide-out-to-top-48%': 'slideOutToTop48 200ms ease-in',
        'fade-out-0': 'fadeOut0 200ms ease-in',
        'fade-in-0': 'fadeIn0 200ms ease-out',
        'fade-out-80': 'fadeOut80 200ms ease-in',
        'slide-out-to-right-full': 'slideOutToRightFull 200ms ease-in',
        'slide-in-from-top-full': 'slideInFromTopFull 200ms ease-out',
        'slide-in-from-bottom-full': 'slideInFromBottomFull 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeOut: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        fadeIn0: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeOut0: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        fadeOut80: {
          from: { opacity: '1' },
          to: { opacity: '0.2' },
        },
        zoomIn95: {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        zoomOut95: {
          from: { transform: 'scale(1)', opacity: '1' },
          to: { transform: 'scale(0.95)', opacity: '0' },
        },
        slideInFromTop: {
          from: { transform: 'translateY(-100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideInFromBottom: {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideInFromLeft: {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromRight: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutToTop: {
          from: { transform: 'translateY(0)', opacity: '1' },
          to: { transform: 'translateY(-100%)', opacity: '0' },
        },
        slideOutToBottom: {
          from: { transform: 'translateY(0)', opacity: '1' },
          to: { transform: 'translateY(100%)', opacity: '0' },
        },
        slideOutToLeft: {
          from: { transform: 'translateX(0)', opacity: '1' },
          to: { transform: 'translateX(-100%)', opacity: '0' },
        },
        slideOutToRight: {
          from: { transform: 'translateX(0)', opacity: '1' },
          to: { transform: 'translateX(100%)', opacity: '0' },
        },
        slideInFromTop2: {
          from: { transform: 'translateY(-0.5rem)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideInFromBottom2: {
          from: { transform: 'translateY(0.5rem)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideInFromLeft2: {
          from: { transform: 'translateX(-0.5rem)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromRight2: {
          from: { transform: 'translateX(0.5rem)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromLeftHalf: {
          from: { transform: 'translateX(-50%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromTop48: {
          from: { transform: 'translateY(-48%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideOutToLeftHalf: {
          from: { transform: 'translateX(0)', opacity: '1' },
          to: { transform: 'translateX(-50%)', opacity: '0' },
        },
        slideOutToTop48: {
          from: { transform: 'translateY(0)', opacity: '1' },
          to: { transform: 'translateY(-48%)', opacity: '0' },
        },
        slideOutToRightFull: {
          from: { transform: 'translateX(0)', opacity: '1' },
          to: { transform: 'translateX(100%)', opacity: '0' },
        },
        slideInFromTopFull: {
          from: { transform: 'translateY(-100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideInFromBottomFull: {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
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