import Button from "@mui/material/Button";

export const CustomButton = (props: {
  label: string;
  onClick: any;
  color?: string;
  textSize?: string;
  textColor?: string;
  padding?: string;
  maxWidth?: string;
}) => {
  return (
    <Button
      variant="contained"
      size="small"
      fullWidth
      className={`!rounded-2xl !text-${props.textSize} !text-${
        props.textColor
      } ${props.padding} !max-w-${props.maxWidth || "48"}
      } !bg-[${props.color}]`}
      onClick={props.onClick}>
      {props.label}
    </Button>
  );
};
