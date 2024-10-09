import {useUpdateModal} from "@cerberus/core/src/providers/ModalProvider.tsx";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import {Button, IconButton, SvgIcon, Tooltip, Typography} from "@mui/material";
import {TreeItem} from "@mui/x-tree-view";
import {Link} from "react-router-dom";
import {useOrganizationalStructureLocales} from "../../locales/ca/locales.ts";
import {AddCamera} from "../../ui-components/add-camera/component.tsx";
import {AddLocationModal} from "../locations/add-location/component.tsx";
import {
  HierarchyItem,
  HierarchyItemType,
  LocationNode,
} from "../state/hierarchy-item.ts";

export const TreeNode = ({node}: {node: LocationNode}) => {
  const icons = {
    camera: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M15.333 7.556v8.888H4.223V7.556h11.11m1.111-2.223H3.111C2.497 5.333 2 5.831 2 6.444v11.112c0 .613.497 1.11 1.111 1.11h13.333c.614 0 1.112-.497 1.112-1.11V13.67L22 18.116V5.889l-4.444 4.444V6.444c0-.613-.498-1.11-1.112-1.11Z" />
      </svg>
    ),
  };

  const updateModal = useUpdateModal();

  const openModal = () => {
    console.log("MODAL: Afegir un nou dispositiu");
    updateModal({
      title: "Afegir un nou dispositiu",
      maxWidth: "lg",
      closeAction: true,
      className: "modal",
      content: AddCamera,
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
              onClick={() => console.log("Add camera SUBMIT")}>
              Afegir
            </Button>
          ),
        },
      ],
    });
  };

  const hasCameraChildren = node.children.some(
    (child) => child.type === HierarchyItemType.camera
  );

  return (
    <div
      className={`${
        node.type === HierarchyItemType.camera ? "flex items-center" : "flex"
      }`}
      style={{width: "100%"}}>
      {node.type === HierarchyItemType.camera && (
        <SvgIcon
          color="primary"
          sx={{
            width: "1.6rem",
            height: "1.6rem",
            marginLeft: "1.2rem",
            fill: "currentColor",
            position: "relative",
            left: "20px",
          }}>
          {icons.camera}
        </SvgIcon>
      )}
      <TreeItem
        itemId={node.id}
        label={<Link to={getItemUrl(node)}>{node.description}</Link>}
        sx={{flex: 1}}>
        {node.children.map((child) => (
          <TreeNode key={child.id} node={child} />
        ))}
        {hasCameraChildren && (
          <div className="flex items-center  mt-2 ml-10">
            <Tooltip
              title={useOrganizationalStructureLocales("addCamera.addBtn")}>
              <Typography
                component="button"
                variant="body1"
                color="primary"
                onClick={openModal}>
                + Afegir dispositiu
              </Typography>
            </Tooltip>
          </div>
        )}
      </TreeItem>
      {!hasCameraChildren && node.type !== HierarchyItemType.camera && (
        // {node.type !== HierarchyItemType.camera && (
        <div style={{marginLeft: "1.2rem"}}>
          <Tooltip
            title={useOrganizationalStructureLocales("addLocation.title")}>
            <IconButton
              sx={{margin: 0, padding: 0}}
              onClick={AddLocationModal()}>
              <AddIcon
                color="primary"
                sx={{
                  alignSelf: "center",
                }}
              />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

const getItemUrl = (item: HierarchyItem) =>
  `locations/${item.id}?item-type=${item.type}`;
