import {Button} from "@mui/material";

export const CustomButton = (props: {
  label: string;
  onClick: any;
  color?: string;
  textSize?: string;
}) => {
  return (
    <Button
      variant="contained"
      size="small"
      fullWidth
      className={`!rounded-2xl !text-${props.textSize} !max-w-48 !max-h-6 !bg-[${props.color}]`}
      onClick={props.onClick}>
      {props.label}
    </Button>
  );
};
