import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useOrganizationalStructureLocales } from "../../locales/ca/locales";

enum AddMenuType {
  LOCATION = "addLocation",
  CAMERA = "addCamera",
}

export const AddMenu = (props: {
  onAddLocation: () => void;
  onAddCamera: () => void;
}) => {
  const options = [AddMenuType.LOCATION, AddMenuType.CAMERA];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (options.length > 0) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleAddLocation = () => {
    props.onAddLocation();
    setAnchorEl(null);
  };

  const handleAddCamera = () => {
    props.onAddCamera();
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {options.length > 0 && (
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          sx={{ top: "-4px" }}>
          <MoreVertIcon color="primary" />
        </IconButton>
      )}
      <div>
        {options.length > 1 && (
          <Menu
            id="lock-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "lock-button",
              role: "listbox",
            }}
            classes={{ paper: "w-[200px]" }}>
            {options.map((option) => (
              <div className="flex pl-2" key={option}>
                <AddIcon
                  color="primary"
                  sx={{
                    alignSelf: "center",
                  }}
                />
                <MenuItem
                  sx={{ paddingBottom: "4px", fontWeight: "500 !important" }}
                  onClick={
                    AddMenuType.LOCATION === option
                      ? handleAddLocation
                      : handleAddCamera
                  }>
                  {useOrganizationalStructureLocales(`${option}.addBtn`)}
                </MenuItem>
              </div>
            ))}
          </Menu>
        )}
      </div>
    </div>
  );
};
