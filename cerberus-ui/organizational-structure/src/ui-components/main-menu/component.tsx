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
          overflow: "visible",
        },
      }}
    >
      <Box color="CaptionText" gap={4} className="h-full">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-center h-20 max-h-24 ">
              <Link to={"/"}>
                <img className="h-full w-full p-8" src={props.logo} alt={props.logo} />
              </Link>
            </div>
            <div className="flex p-4 bg-[#202020] relative">
              <div className="flex flex-col items-start gap-y-1">
                <Typography variant="h3" fontWeight="bold">154</Typography>
                <Typography variant="body2" fontWeight="bold" color='#909090'>Alertas Activas</Typography>
              </div>
              <div className="flex flex-col items-start gap-y-1 ml-8">
                <Typography variant="h3" fontWeight="bold">11</Typography>
                <Typography variant="body2" fontWeight="bold" color='#909090'>Nuevas alertas</Typography>
              </div>
              <button
                className="absolute -right-3 top-1/2 -translate-y-1/2 bg-[#353535] text-white rounded-xl p-3 hover:bg-[#636363] transition-colors z-50"
                onClick={() => setOpen(!open)}
              >
                <svg
                  className="w-5 h-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.95121,1.99995L4.95118,11.99842l10.00002,10.00158,3.00344-3.00344-6.72184-6.99814,1.85764-2.12302,4.87201-4.87201-3.01125-3.00344Z" />
                </svg>
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