import {CircularProgress, Typography} from "@mui/material";

export const Fetching = () => {
  return (
    <div
      className={`flex felx-col w-full h-full items-center justify-center  }`}>
      <div className="flex flex-col items-center justify-center gap-4">
        <Typography variant="h6">Carregant dades...</Typography>
        <CircularProgress style={{color: "#ffc200"}} size={52} />
      </div>
    </div>
  );
};
