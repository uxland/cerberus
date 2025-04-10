import { HandlerBase, registerCommandHandler } from "@cerberus/core";
import {Round, RoundEditionData, SurveillanceGroup} from "./domain";
import { Mediator } from "mediatr-ts";
import { OperationSummary } from "../../operation/list/model.ts";
import { ListLocationSubHierarchy, LocationHierarchicalItem } from "@cerberus/organizational-structure";
import { ListOperations } from "../../operation/list/query.ts";
import { Container } from "inversify";
import { produceRoundEditionData, getCamerasFromHierarchy } from "./domain/model";
import { IRequest } from "mediatr-ts";

export class GetRoundEditionData implements IRequest<RoundEditionData> {
    constructor(public locationId: string, public roundId: string) { }
}

class GetRoundEditionDataHandler extends HandlerBase<RoundEditionData, GetRoundEditionData> {
    handle(request: GetRoundEditionData): Promise<RoundEditionData> {
        return this.fetchRoundEditionData(request);
    }

    private async fetchRoundEditionData({ locationId, roundId }: GetRoundEditionData): Promise<RoundEditionData> {
        const masterDataTask = Promise.all([
            this.fetchLocationHierarchy(locationId),
            this.fetchOperations(),
            this.fetchGroups()
        ]);
        return roundId === "new" ?
            this.createNewRound(locationId, masterDataTask) :
            this.retrieveRound(roundId, masterDataTask);
    }
    private async createNewRound(locationId: string, masterDataFetch: Promise<[LocationHierarchicalItem[], OperationSummary[], SurveillanceGroup[]]>): Promise<RoundEditionData> {
        const [locations, operations, groups] = await masterDataFetch;
        return produceRoundEditionData(locationId, operations, locations, groups);
    }

    private async retrieveRound(roundId: string, masterDataFetch: Promise<[LocationHierarchicalItem[], OperationSummary[], SurveillanceGroup[]]>): Promise<RoundEditionData> {
        const round = await this.fetchRound(roundId);
        console.log("Retrieve round:", round);
        const [locations, operations, groups] = await masterDataFetch;
        const cameras = getCamerasFromHierarchy(locations);
        return {
            round,
            operations,
            locations: cameras,
            groups,
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

    private fetchGroups(): Promise<SurveillanceGroup[]> {
        return  this.apiClient.get<SurveillanceGroup[]>("surveillance/rounds/master-data/groups");
    }
}

export const useGetRoundEditionData = (container: Container) => {
    registerCommandHandler(GetRoundEditionData, GetRoundEditionDataHandler);
    return Promise.resolve(container);
}