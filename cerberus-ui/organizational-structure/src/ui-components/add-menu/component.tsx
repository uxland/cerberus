import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {useState} from "react";

export const AddMenu = () => {
  const options = ["Afegir Localització", "Afegir Càmera"];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}>
        <MoreVertIcon color="primary" />
      </IconButton>
      <div>
        {options?.length > 1 ? (
          <Menu
            id="lock-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "lock-button",
              role: "listbox",
            }}
            classes={{paper: "w-[200px]"}}>
            {options.map((option) => (
              <div className="flex">
                <AddIcon
                  color="primary"
                  sx={{
                    alignSelf: "center",
                  }}
                />
                <MenuItem
                  key={option}
                  selected={option === "Pyxis"}
                  sx={{paddingBottom: "4px"}}
                  onClick={handleClose}>
                  {option}
                </MenuItem>
              </div>
            ))}
          </Menu>
        ) : null}
      </div>
    </div>
  );
};
