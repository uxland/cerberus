
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