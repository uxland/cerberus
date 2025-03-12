import {ConfirmationContentProps} from "./interaction-service.ts";

export const ConfirmationMessage = ({data}: ConfirmationContentProps<string>) =>{
    return (<div>{data}</div>)
}