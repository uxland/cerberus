import {inject, injectable} from "inversify";
import {ApiClient} from "@cerberus/shared/src";

@injectable()
export abstract class UploadOrganizationalStructureFileFacade{
    abstract upload(file: File): Promise<void>;
}

@injectable()
export class UploadOrganizationalStructureFileFacadeImpl extends UploadOrganizationalStructureFileFacade{
    constructor(@inject(ApiClient) private apiClient: ApiClient) {
        super();
    }

    async upload(file: File): Promise<void>{
        const formData = new FormData();
        formData.append("file", file);
        await this.apiClient.postFile("/locations", {
            body: formData,
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}