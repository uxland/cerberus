import {useUpdateModal} from "@cerberus/core/src/providers/ModalProvider.tsx";
import {Tooltip} from "@mui/material";
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import {TreeItem} from "@mui/x-tree-view";
import {Link} from "react-router-dom";
import {useOrganizationalStructureLocales} from "../../locales/ca/locales.ts";
import {AddCamera} from "../../ui-components/add-camera/component.tsx";
import {AddMenu} from "../../ui-components/add-menu/component.tsx";
import {AddLocationModal} from "../locations/add-location/component.tsx";
import {
  HierarchyItem,
  HierarchyItemType,
  LocationNode,
} from "../state/hierarchy-item.ts";

export const TreeNode = ({node}: {node: LocationNode}) => {
  const updateModal = useUpdateModal();
  const icons = {
    camera: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M15.333 7.556v8.888H4.223V7.556h11.11m1.111-2.223H3.111C2.497 5.333 2 5.831 2 6.444v11.112c0 .613.497 1.11 1.111 1.11h13.333c.614 0 1.112-.497 1.112-1.11V13.67L22 18.116V5.889l-4.444 4.444V6.444c0-.613-.498-1.11-1.112-1.11Z" />
      </svg>
    ),
  };

  const openModal = () => {
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
      </TreeItem>
      {node.type !== HierarchyItemType.camera && (
        <div style={{marginLeft: "1.2rem"}}>
          <Tooltip
            title={useOrganizationalStructureLocales("addLocation.title")}>
            <div>
              <AddMenu
                onAddCamera={openModal}
                onAddLocation={AddLocationModal(
                  node?.parentId === undefined ? "" : node?.id
                )}
              />
            </div>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

const getItemUrl = (item: HierarchyItem) =>
  `locations/${item.id}?item-type=${item.type}`;
