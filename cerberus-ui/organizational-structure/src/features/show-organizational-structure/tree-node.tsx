import { TreeItem } from '@mui/x-tree-view';
import {HierarchyItem, LocationNode} from './hierarchy-item.ts';
import { Link } from "react-router-dom";

export const TreeNode = ({ node }: { node: LocationNode }) => {


    return (
        <TreeItem
            itemId={node.id}
            label={
                <Link to={getItemUrl(node)}>
                    {node.description}
                </Link>
            }
        >
            {node.children.map((child) => (
                <TreeNode key={child.id} node={child} />
            ))}
        </TreeItem>
    );
};

const getItemUrl = (item: HierarchyItem) => `locations/${item.id}?item-type=${item.type}`;