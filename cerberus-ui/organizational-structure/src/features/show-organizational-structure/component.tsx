import {Mediator} from "mediatr-ts";
import {ListLocationChildren} from "./list-location-children.ts";
import {useEffect, useState} from "react";
import {HierarchyItem} from "./hierarchy-item.ts";

export const OrganizationalStructureTreeNode = (props: {id?: string | undefined}) => {

    const [children, setChildren] = useState<HierarchyItem[]>([])
    useEffect(() => {
        async function fetchData() {
            const hierarchyItems = await new Mediator().send(new ListLocationChildren(props.id));
            setChildren(hierarchyItems)
        }
        fetchData();

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