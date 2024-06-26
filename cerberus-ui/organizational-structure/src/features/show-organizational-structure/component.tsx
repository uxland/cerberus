import {Mediator} from "mediatr-ts";
import {ListLocationChildren} from "./list-location-children.ts";
import {useEffect, useState} from "react";
import {HierarchyItem} from "./hierarchy-item.ts";

export const OrganizationalStructureTreeNode = (props: string | undefined) => {

    const [children, setChildren] = useState<HierarchyItem[]>([])
    useEffect(async () => {
        const hierarchyItems = await new Mediator().send(new ListLocationChildren(props));
        setChildren(hierarchyItems)

    }, []);
    return (
        children.map((child) => {
        return (
                <div>
                    <h3>{child.description}</h3>
                </div>
            );
        })
    );
}