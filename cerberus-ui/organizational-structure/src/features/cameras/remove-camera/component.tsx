import { DeleteCamera } from "./command";
import { sendMediatorRequest } from "@cerberus/core";

export const RemoveCameraModal = (id: string, description: string) => {

    const handleSubmit = async () => {
        sendMediatorRequest({
            command: new DeleteCamera(id),
        });
    };



    return handleSubmit;
};