import {Box, Divider} from "@mui/material";

export const CustomDivider = (props: {className?: string}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}>
      <Divider
        orientation="vertical"
        variant="middle"
        color="#828282"
        className={props.className}
        flexItem
      />
    </Box>
  );
};
