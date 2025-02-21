import {HandlerBase, registerCommandHandler, RequestBase, SetState} from "@cerberus/core";
import {Round, RoundEditionData} from "./domain";
import {Mediator} from "mediatr-ts";
import {OperationSummary} from "../../operation/list-operations/model.ts";
import {ListLocationSubHierarchy, LocationHierarchicalItem} from "@cerberus/organizational-structure";
import {ListOperations} from "../../operation/list-operations/query.ts";
import {Container} from "inversify";

export class GetRoundEditionData extends RequestBase<RoundEditionData>{
    constructor(public locationId: string, public roundId: string, setState: SetState<RoundEditionData>, setBusy: SetState<boolean>, setError: SetState<string | undefined>) {
        super(setState, setBusy, setError);
    }
}

class GetRoundEditionDataHandler extends HandlerBase<RoundEditionData, GetRoundEditionData>{
    handle(request: GetRoundEditionData): Promise<RoundEditionData> {
        return this.handleRequest(request, this.fetchRoundEditionData.bind(this));
    }

    private async fetchRoundEditionData({locationId, roundId}: GetRoundEditionData): Promise<RoundEditionData> {
        const masterDataTask = Promise.all([this.fetchLocationHierarchy(locationId), this.fetchOperations()]);
       return roundId === "new" ?
           this.createNewRound(locationId, masterDataTask) :
           this.retrieveRound(roundId, masterDataTask);
    }
    private async createNewRound(locationId: string,  masterDataFetch: Promise<[LocationHierarchicalItem[], OperationSummary[]]>) Promise<RoundEditionData> {
        const [locations, operations] = await masterDataFetch;
        return produceRoundEditionData(locationId, operations, locations);

    }

    private async retrieveRound(roundId: string, masterDataFetch: Promise<[LocationHierarchicalItem[], OperationSummary[]]>): Promise<RoundEditionData> {
        const round = await this.fetchRound(roundId);
        const [locations, operations] = await masterDataFetch;
        return {
            round,
            operations,
            locations
        }
    }

    private fetchLocationHierarchy(locationId: string): Promise<LocationHierarchicalItem[]> {
        return new Mediator().send(new ListLocationSubHierarchy(locationId));
    }

    private fetchOperations(): Promise<OperationSummary[]> {
        return new Mediator().send(new ListOperations());
    }

    private fetchRound(roundId: string): Promise<Round> {
        return this.apiClient.get(`surveillance/rounds/${roundId}`);
    }
}

export const useGetRoundEditionData = (container: Container) =>{
    registerCommandHandler(GetRoundEditionData, GetRoundEditionDataHandler);
    return Promise.resolve(container);
}