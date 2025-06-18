import { Tooltip } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";
import { TreeItem } from "@mui/x-tree-view";
import { Link } from "react-router-dom";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useOrganizationalStructureLocales } from "../../locales/ca/locales.ts";
import { AddMenu } from "../../ui-components/add-menu/component.tsx";
import { AddCameraModal } from "../cameras/add-camera/component.tsx";
import { AddLocationModal } from "../locations/add-location/component.tsx";
import { RemoveCameraModal } from "../cameras/remove-camera/component.tsx";
import {
  HierarchyItem,
  HierarchyItemType,
  LocationNode,
} from "../state/hierarchy-item.ts";

const CAMERA_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M15.333 7.556v8.888H4.223V7.556h11.11m1.111-2.223H3.111C2.497 5.333 2 5.831 2 6.444v11.112c0 .613.497 1.11 1.111 1.11h13.333c.614 0 1.112-.497 1.112-1.11V13.67L22 18.116V5.889l-4.444 4.444V6.444c0-.613-.498-1.11-1.112-1.11Z" />
  </svg>
);

const ICON_STYLES = {
  width: "1.6rem",
  height: "1.6rem",
  fill: "currentColor",
} as const;

interface TreeNodeProps {
  node: LocationNode;
}

export const TreeNode = ({ node }: TreeNodeProps) => {
  const locales = useOrganizationalStructureLocales;
  const isCamera = node.type === HierarchyItemType.camera;
  
  const handleLinkClick = (event: React.MouseEvent) => {
    if (window.location.pathname === `/locations/${node.id}`) {
      event.preventDefault();
    }
  };

  const handleDeleteClick = () => {
    RemoveCameraModal(node.id, node.description);
  };

  const renderCameraIcon = () => (
    <SvgIcon
      color="primary"
      sx={{
        ...ICON_STYLES,
        marginRight: "0.5rem",
      }}
    >
      {CAMERA_ICON}
    </SvgIcon>
  );

  const renderLabel = () => (
    <Link
      to={getItemUrl(node)}
      onClick={handleLinkClick}
      style={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        color: "inherit",
        width: "100%",
      }}
    >
      {isCamera && renderCameraIcon()}
      {node.description}
    </Link>
  );

  const renderAddMenu = () => (
    !isCamera && (
      <Tooltip
        title={locales("addLocation.title")}
        placement="right"
      >
        <div style={{ position: "absolute", right: "0", top: "0", zIndex: 1 }}>
          <AddMenu
            onAddCamera={AddCameraModal(node.id)}
            onAddLocation={AddLocationModal(node.id)}
          />
        </div>
      </Tooltip>
    )
  );

  const renderDeleteButton = () => (
    isCamera && (
      <Tooltip title={locales("delete")}>
        <DeleteOutlineIcon
          color="primary"
          className="opacity-0 group-hover:opacity-100"
          onClick={handleDeleteClick}
          sx={{
            ...ICON_STYLES,
            position: "absolute",
            right: "0",
            marginRight: "0.5rem",
            cursor: "pointer",
          }}
        />
      </Tooltip>
    )
  );

  return (
    <div
      className={`${isCamera ? "flex items-center group relative" : "flex relative"}`}
      style={{ width: "100%" }}
    >
      <TreeItem
        itemId={node.id}
        label={renderLabel()}
        sx={{
          flex: 1,
          marginLeft: "0",
        }}
      >
        {node.children.map((child) => (
          <TreeNode key={child.id} node={child} />
        ))}
      </TreeItem>
      
      {renderAddMenu()}
      {renderDeleteButton()}
    </div>
  );
};

const getItemUrl = (item: HierarchyItem): string =>
  `locations/${item.id}?item-type=${item.type}`;