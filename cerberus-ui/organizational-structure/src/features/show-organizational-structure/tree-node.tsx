import {Tooltip} from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";
import {TreeItem} from "@mui/x-tree-view";
import {Link} from "react-router-dom";
import {useOrganizationalStructureLocales} from "../../locales/ca/locales.ts";
import {AddMenu} from "../../ui-components/add-menu/component.tsx";
import {AddCameraModal} from "../cameras/add-camera/component.tsx";
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
            title={useOrganizationalStructureLocales("addLocation.title")}
            placement="right">
            <div>
              <AddMenu
                onAddCamera={AddCameraModal(node.id)}
                onAddLocation={AddLocationModal(node.id)}
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
