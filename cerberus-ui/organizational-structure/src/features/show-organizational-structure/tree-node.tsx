import {SvgIcon} from '@mui/material';
import {TreeItem} from '@mui/x-tree-view';
import {Link} from 'react-router-dom';
import {
  HierarchyItem,
  HierarchyItemType,
  LocationNode,
} from './hierarchy-item.ts';

export const TreeNode = ({node}: {node: LocationNode}) => {
  const icons = {
    camera: (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
        <path d='M15.333 7.556v8.888H4.223V7.556h11.11m1.111-2.223H3.111C2.497 5.333 2 5.831 2 6.444v11.112c0 .613.497 1.11 1.111 1.11h13.333c.614 0 1.112-.497 1.112-1.11V13.67L22 18.116V5.889l-4.444 4.444V6.444c0-.613-.498-1.11-1.112-1.11Z' />
      </svg>
    ),
  };

  return (
    <div
      className={`${
        node.type === HierarchyItemType.camera ? 'flex items-center' : ''
      }`}>
      {node.type === HierarchyItemType.camera && (
        <SvgIcon
          color='primary'
          sx={{
            width: '1.6rem',
            height: '1.6rem',
            marginLeft: '1.2rem',
            marginRight: '-1.2rem',
          }}>
          '{icons.camera}
        </SvgIcon>
      )}
      <TreeItem
        itemId={node.id}
        label={<Link to={getItemUrl(node)}>{node.description}</Link>}>
        {node.children.map((child) => (
          <TreeNode key={child.id} node={child} />
        ))}
      </TreeItem>
    </div>
  );
};

const getItemUrl = (item: HierarchyItem) =>
  `locations/${item.id}?item-type=${item.type}`;
