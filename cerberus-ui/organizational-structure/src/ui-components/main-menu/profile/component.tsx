import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";

export const Profile = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    // { label: "Mi Perfil", onClick: () => console.log("Profile") },
    { label: "Configuración", onClick: () => console.log("Settings") },
    { label: "Cerrar Sesión", onClick: () => console.log("Logout") },
  ];

  return (
    <div className="flex mt-auto p-6 bg-[#202020] items-center">
      <img
        className="h-12 rounded-full"
        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
      />
      <div className="flex flex-col ml-4">
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Usuario 1
        </Typography>
        <Typography className="text-gray-300" variant="caption">
          Supervisor
        </Typography>
      </div>

      <IconButton
        aria-label="more"
        id="profile-button"
        aria-controls={open ? "profile-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ marginLeft: "auto" }}
      >
        <MoreVertIcon sx={{ color: "#d1d5db", transform: "rotate(90deg)" }} />
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "profile-button",
        }}
      >
        {menuItems.map((item, index) => (
          <div key={index}>
            <MenuItem
              sx={{ paddingBottom: "4px", fontWeight: "500 !important" }}
              onClick={() => {
                item.onClick();
                handleClose();
              }}
            >
              {item.label}
            </MenuItem>
          </div>
        ))}
      </Menu>
    </div>
  );
};
