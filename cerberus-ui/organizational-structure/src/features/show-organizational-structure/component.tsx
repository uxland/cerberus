import {SimpleTreeView, TreeItem} from '@mui/x-tree-view';
import {Mediator} from 'mediatr-ts';
import {useEffect, useState} from 'react';
import {HierarchyItem} from './hierarchy-item.ts';
import {ListLocationChildren} from './list-location-children.ts';
import {Link} from "react-router-dom";

export const OrganizationalStructureTreeNode = (props: {
  id?: string | undefined;
}) => {
  const [children, setChildren] = useState<HierarchyItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      const hierarchyItems = await new Mediator().send(
        new ListLocationChildren(props.id)
      );
      setChildren(hierarchyItems);
    }
    fetchData();
  }, [props.id]);

  return (
    <SimpleTreeView>
      {children.map((child) => (
        <TreeNode key={child.id} node={child} />
      ))}
    </SimpleTreeView>
  );
};

const TreeNode = ({node}: {node: HierarchyItem}) => {
  const [children, setChildren] = useState<HierarchyItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleItemClick = async (itemId: string) => {
    if (!isLoaded) {
      const hierarchyItems = await new Mediator().send(
        new ListLocationChildren(itemId)
      );
      setChildren(hierarchyItems);
      setIsLoaded(true);
    }
  };

  return (
    <TreeItem
      itemId={node.id}
      label={node.description}
      onClick={() => handleItemClick(node.id)}>
      {children.map((child) => (
        <TreeNode key={child.id} node={child} />
      ))}
    </TreeItem>

  );
};

const getItemUrl = (item: HierarchyItem) => item.type === 'Location' ? `locations/${item.id}` : `cameras/${item.id}`;