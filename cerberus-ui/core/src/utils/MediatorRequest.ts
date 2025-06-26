import { IRequest } from "mediatr-ts";
import { Mediator } from "mediatr-ts";
import { Dispatch, SetStateAction } from 'react';
import { AxiosError } from 'axios';

type SetState<T> = Dispatch<SetStateAction<T>>;

interface MediatorRequestProps<T> {
    command: IRequest<T>;
    setBusy?: SetState<boolean>;
    setError?: SetState<AxiosError | Error | undefined>;
    setState?: SetState<T>;
}
export const sendMediatorRequest = async <T>({ command, setBusy, setError, setState }: MediatorRequestProps<T>) => {
    try {
        setBusy?.(true);
        const request = await new Mediator().send(command);
        setState?.(request);
    }
    catch (error) {
        setError?.(error);
    }
    finally {
        setBusy?.(false);
    }
}