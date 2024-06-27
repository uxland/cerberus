
export const enum HierarchyItemType {
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