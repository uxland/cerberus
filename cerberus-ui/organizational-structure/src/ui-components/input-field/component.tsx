import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export const InputField = (props: {
  ref: any;
  title: string;
  value: string;
  onChange: any;
}) => {
  return (
    <div className="flex flex-col flex-1 gap-2">
      <Typography variant="body1">{props.title}</Typography>
      <TextField
        ref={props.ref}
        value={props.value}
        onChange={props.onChange}
        // placeholder={`${useOrganizationalStructureLocales(
        //   "addLocation.placeholder"
        // )} ${props.value}`}
        variant="outlined"
        sx={{
          width: "100%",
          height: "50px",
          backgroundColor: "#313131",
          color: "#d7dadb",
          borderRadius: "6px",
        }}
      />
    </div>
  );
};
