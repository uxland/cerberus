import {SimpleTreeView} from '@mui/x-tree-view';
import {connect} from 'react-redux';
import {LocationNode} from '../state/hierarchy-item.ts';
import {TreeNode} from './tree-node.tsx';

const mapStateToProps = (state: any) => {
  return {
    locationHierarchy: state.locationHierarchy,
  };
};

const OrganizationalStructureTreeNode = (props: {
  locationHierarchy: LocationNode[];
}) => {
  return (
    <SimpleTreeView>
      {(props.locationHierarchy || []).map((child) => (
        <TreeNode key={child.id} node={child} />
      ))}
    </SimpleTreeView>
  );
};

export default connect(mapStateToProps)(OrganizationalStructureTreeNode);
