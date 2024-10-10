import {Box, Button, Drawer, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {OrganizationalStructureTreeNode} from "../../features";
import {AddLocationModal} from "../../features/locations/add-location/component";

export const DrawerMenu = (props: {logo}) => {
  return (
    <Drawer
      PaperProps={{sx: {width: "20vw"}}}
      anchor="left"
      variant="permanent">
      <Box color={"CaptionText"} gap={4}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-center h-20 max-h-24">
              <Link to={"/"}>
                {<img className="h-14" src={props.logo} alt={props.logo} />}
              </Link>
            </div>
            <div className="flex p-6 bg-[#202020] justify-between">
              <div className="flex flex-col items-start p-1">
                <Typography variant="h3">154</Typography>
                <Typography variant="body1">Alertas Activas</Typography>
              </div>
            </div>
          </div>
          <div className="h-full pl-2 pr-2 gap-2">
            <Button
              variant="contained"
              size="small"
              type="submit"
              fullWidth
              className="submit-btn"
              onClick={AddLocationModal()}>
              Afegir Node Arrel
            </Button>
            {<OrganizationalStructureTreeNode />}
          </div>
        </div>
      </Box>
    </Drawer>
  );
};
