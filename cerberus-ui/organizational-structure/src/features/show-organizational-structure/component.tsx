import {SimpleTreeView} from '@mui/x-tree-view';
import {TreeNode} from "./tree-node.tsx";
import {connect} from 'react-redux';
import {LocationNode} from "../state/hierarchy-item.ts";

const mapStateToProps = (state: any) => {
  return {
    locationHierarchy: state.locationHierarchy,
  };
}

const OrganizationalStructureTreeNode = ({locationHierarchy}: {locationHierarchy: LocationNode[]}) => {
  return (
    <SimpleTreeView>
      {locationHierarchy.map((child) => (
        <TreeNode key={child.id} node={child} />
      ))}
    </SimpleTreeView>
  );
};

export default connect(mapStateToProps)(OrganizationalStructureTreeNode)