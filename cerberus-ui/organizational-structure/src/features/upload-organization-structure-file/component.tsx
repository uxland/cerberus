import {Button, CircularProgress, Typography} from "@mui/material";
import {Mediator} from "mediatr-ts";
import {MuiFileInput} from "mui-file-input";
import {useState} from "react";
import {useOrganizationalStructureLocales} from "../../locales/ca/locales.ts";
import {UploadOrganizationStructureFile} from "./command.ts";

export const OrganizationalStructureFileUploader = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const submit = async (event) => {
    setError("");
    event.preventDefault();
    setUploading(true);
    try {
      await new Mediator().send(new UploadOrganizationStructureFile(file));
    } catch (e) {
      setError(e.message || e.toString());
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (newFile) => {
    setFile(newFile);
  };
  return (
    <form onSubmit={submit}>
      <Typography variant="h6" component="h6">
        {useOrganizationalStructureLocales("upload.title")}
      </Typography>
      <div className="flex gap-4 w-[500px] items-end">
        <div className="flex items-center justify-center w-80">
          {uploading ? (
            <CircularProgress style={{marginTop: 16, color: "#fff"}} />
          ) : (
            <MuiFileInput
              value={file}
              variant="outlined"
              color="secondary"
              size="small"
              onChange={handleFileChange}
              inputProps={{accept: ".xlsx,.xls"}}
              fullWidth
              margin="normal"
              placeholder="Pujar arxiu format .xlsx,.xls "
            />
          )}
        </div>
        <Button
          variant="contained"
          size="small"
          disabled={!file || uploading}
          type="submit"
          fullWidth
          className="submit-btn flex-1">
          {useOrganizationalStructureLocales("upload.file")}
        </Button>
        {error && (
          <Typography variant="h6" color="error" component="h6">
            {error}
          </Typography>
        )}
      </div>
    </form>
  );
};
