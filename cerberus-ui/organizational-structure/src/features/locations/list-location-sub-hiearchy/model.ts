export interface LocationHierarchicalItem{
    id: string;
    description: string;
    type: "Location" | "Camera";
    children: LocationHierarchicalItem[];
    streamingUrl?: string;
}