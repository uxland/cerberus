
export const enum HierarchyItemType {
    location = 0,
    camera = 1,
}

export interface HierarchyItem {
    id: string;
    parentId: string | undefined;
    description: string;
    path: string;
    type: HierarchyItemType;
}