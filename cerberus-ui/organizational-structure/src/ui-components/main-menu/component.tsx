import {useUpdateModal} from "@cerberus/core/src/providers";
import {Box, Button, Drawer, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {OrganizationalStructureTreeNode} from "../../features";
import {AddLocation} from "../../features/locations/add-location/component";

export const DrawerMenu = (props: {logo}) => {
  const updateModal = useUpdateModal();
  const openModal = () => {
    console.log("MODAL: Afegir un nou dispositiu");
    updateModal({
      title: "Afegir un nou dispositiu",
      maxWidth: "lg",
      closeAction: true,
      className: "modal",
      content: AddLocation,
      actions: [
        {
          id: "0",
          sort: 1,
          content: () => (
            <Button
              variant="contained"
              size="small"
              color="success"
              fullWidth
              className="!rounded-2xl !w-52 !text-white !bg-[#02bc77]"
              onClick={() => console.log("Add location SUBMIT")}>
              Afegir
            </Button>
          ),
        },
      ],
    });
  };
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
              onClick={openModal}>
              Afegir
            </Button>
            {<OrganizationalStructureTreeNode />}
          </div>
        </div>
      </Box>
    </Drawer>
  );
};
