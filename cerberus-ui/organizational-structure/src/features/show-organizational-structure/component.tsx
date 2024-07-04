import {SimpleTreeView} from '@mui/x-tree-view';
import {Mediator} from 'mediatr-ts';
import {useEffect, useState} from 'react';
import {LocationNode} from './hierarchy-item.ts';
import {ListLocationHierarchy} from './list-location-children.ts';
import {TreeNode} from "./tree-node.tsx";

export const OrganizationalStructureTreeNode = () => {
  const [children, setChildren] = useState<LocationNode[]>([]);

  useEffect(() => {
    async function fetchData() {
      const hierarchyItems = await new Mediator().send(
        new ListLocationHierarchy()
      );
      setChildren(hierarchyItems);
    }
    fetchData();
  }, []);

  return (
    <SimpleTreeView>
      {children.map((child) => (
        <TreeNode key={child.id} node={child} />
      ))}
    </SimpleTreeView>
  );
};