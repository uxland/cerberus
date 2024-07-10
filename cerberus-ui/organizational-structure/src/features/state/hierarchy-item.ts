
export enum HierarchyItemType {
    location = "Location",
    camera = "Camera",
}

export interface HierarchyItem {
    id: string;
    parentId: string | undefined;
    description: string;
    path: string;
    type: HierarchyItemType;
}

export interface LocationNode extends HierarchyItem {
    children: LocationNode[];
}

export const buildLocationsTree = (items: HierarchyItem[], parentId = "", visited: Set<string> = new Set()): LocationNode[] => {
    const children = items.filter((item) => (item.parentId || "") === parentId);
    return children.map((child) => {
        if (visited.has(child.id)) {
            throw new Error(`Circular reference detected: ${child.id}`);
        }
        visited.add(child.id);
        return {
            ...child,
            children: buildLocationsTree(items, child.id, visited),
        };
    });
}