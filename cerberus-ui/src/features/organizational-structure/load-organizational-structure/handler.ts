import {ListStructureItems} from "./query.ts";
import {IRequestHandler} from "mediatr-ts";

class ListStructureItemsHandler implements IRequestHandler<ListStructureItems, any>
    constructor(private apiClient: IApiClient) {
    }
}