import {HandlerBase} from "@cerberus/core";
import {DownloadReport} from "./command.ts";
import {runsEndpointUrl} from "../constants.ts";

export class DownloadReportHandler extends HandlerBase<void, DownloadReport>{
    async handle(request: DownloadReport): Promise<void> {
        //return this.apiClient.get<Run>(`${runsEndpointUrl}${request.id}`);
        const file = await this.apiClient.getFile(`${runsEndpointUrl}${request.runId}/report?format=${request.format}`, {
            headers: {
                "Accept": `application/${request.format}`,
            }
        });
        const filename = file.filename || `report-${request.runId}.${request.format}`;
        const url = window.URL.createObjectURL(file.content);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

    }

}