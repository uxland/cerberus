import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { OrganizationalStructureTreeNode } from "../../features";
import { AddLocationModal } from "../../features/locations/add-location/component";
import { Profile } from "./profile/component";

export const MainMenu = (props: { logo: string, open: boolean, setOpen: (open: boolean) => void }) => {
  const { open, setOpen } = props;

  return (
    <Drawer
      anchor="left"
      variant="persistent"
      open={open}
      PaperProps={{
        sx: {
          width: open ? "300px" : "40px",
          transition: "width 0.3s ease-in-out",
          overflow: "hidden",
        },
      }}
    >
      <Box color="CaptionText" gap={4} className="overflow-hidden h-full">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-center h-20 max-h-24 bg-[#111111]">
              <Link to={"/"}>
                <img className="h-full w-full p-8" src={props.logo} alt={props.logo} />
              </Link>
            </div>
            <div className="flex p-6 bg-[#202020] justify-between">
              <div className="flex flex-col items-start p-1">
                <Typography variant="h3">154</Typography>
                <Typography variant="body1">Alertas Activas</Typography>
              </div>
              <button
                className="ml-auto bg-[#202020] text-white rounded-lg text-2xl p-2"
                onClick={() => setOpen(!open)}
              >
                &lt;
              </button>
            </div>
          </div>
          <div className="h-full pl-2 pr-2 gap-2">
            <Button
              variant="contained"
              size="small"
              fullWidth
              className="submit-btn"
              onClick={AddLocationModal(undefined)}
            >
              Afegir Node Arrel
            </Button>
            <OrganizationalStructureTreeNode />
          </div>
        </div>
      </Box>
      <Profile />
    </Drawer>
  );
};