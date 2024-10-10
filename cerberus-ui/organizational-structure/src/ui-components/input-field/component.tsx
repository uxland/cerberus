import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export const InputField = (props: {
  title: string;
  onChange: any;
  required?: boolean;
  value?: string;
}) => {
  return (
    <div className="flex flex-col flex-1 gap-2">
      <Typography variant="body1">{props.title}</Typography>
      <TextField
        value={props.value}
        onChange={props.onChange}
        variant="outlined"
        required={props.required === true ? true : false}
        sx={{
          width: "100%",
          height: "50px",
          padding: "0",
          backgroundColor: "#313131",
          borderRadius: "6px",
          "& input": {
            padding: "16px 12px",
            height: "100%",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#a1a1a1",
              borderRadius: "6px",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ababab",
            },
          },
          "& .MuiInputBase-input": {
            color: "#a1a1a1 !important",
          },
          "& .MuiInputBase-input:focus": {
            color: "#fff !important",
          },
        }}
        InputProps={{
          style: {
            color: "#d7dadb",
          },
        }}
      />
    </div>
  );
};
