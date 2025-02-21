import {LocationHierarchicalItem} from './model'
import {RequestBase, SetState} from "@cerberus/core";

export class ListLocationSubHierarchy extends RequestBase<LocationHierarchicalItem[]> {
    constructor(public locationId: string, setState:SetState<LocationHierarchicalItem[]>, setBusy: SetState<boolean>, setError: SetState<Error>) {
        super(setState, setBusy, setError);
    }
}