import { HandlerBase, registerCommandHandler } from "@cerberus/core";
import { Round, RoundEditionData } from "./domain";
import { Mediator } from "mediatr-ts";
import { OperationSummary } from "../../operation/list-operations/model.ts";
import { ListLocationSubHierarchy, LocationHierarchicalItem } from "@cerberus/organizational-structure";
import { ListOperations } from "../../operation/list-operations/query.ts";
import { Container } from "inversify";
import { produceRoundEditionData } from "./domain/model";
import { IRequest } from "mediatr-ts";

export class GetRoundEditionData implements IRequest<RoundEditionData> {
    constructor(public locationId: string, public roundId: string) { }
}

class GetRoundEditionDataHandler extends HandlerBase<RoundEditionData, GetRoundEditionData> {
    handle(request: GetRoundEditionData): Promise<RoundEditionData> {
        return this.fetchRoundEditionData(request);
    }

    private async fetchRoundEditionData({ locationId, roundId }: GetRoundEditionData): Promise<RoundEditionData> {
        const masterDataTask = Promise.all([this.fetchLocationHierarchy(locationId), this.fetchOperations()]);
        return roundId === "new" ?
            this.createNewRound(locationId, masterDataTask) :
            this.retrieveRound(roundId, masterDataTask);
    }
    private async createNewRound(locationId: string, masterDataFetch: Promise<[LocationHierarchicalItem[], OperationSummary[]]>): Promise<RoundEditionData> {
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

export const useGetRoundEditionData = (container: Container) => {
    registerCommandHandler(GetRoundEditionData, GetRoundEditionDataHandler);
    return Promise.resolve(container);
}