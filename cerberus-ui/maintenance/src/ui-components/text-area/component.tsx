import {Box, TextareaAutosize} from '@mui/material';

export const CustomTextArea = (onchange: any) => {
  return (
    <Box
      component={TextareaAutosize}
      onChange={onchange}
      placeholder='Write a comment...'
      sx={{
        width: '100%',
        backgroundColor: '#313131',
        color: '#d7dadb',
        fontSize: '12px',
        minHeight: '100px',
        padding: '10px',
        '&:focus': {
          borderColor: '#707070',
          outline: 'none',
          boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.25)',
        },
        borderRadius: '6px',
        border: '1px solid #707070',
      }}
    />
  );
};
