import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListOperations } from "./query.ts";
import { ErrorView } from "@cerberus/core";
import { OperationSummary } from "./model.ts";
import { OperationsTable } from "../../../components/index.ts";
import { Typography, Box, CircularProgress } from "@mui/material";
import { sendMediatorRequest } from "@cerberus/core";
import { useSurveillanceLocales } from "../../../locales/ca/locales.ts";
import { AxiosError } from "axios";

export const OperationsView = (props: { id: string }) => {
    const error403 = useSurveillanceLocales("operation.errors.list.403");
    const error500 = useSurveillanceLocales("operation.errors.list.500");
    const createOperation = useSurveillanceLocales("operation.create.createOperation");

    const [operations, setOperations] = useState<OperationSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AxiosError>(undefined);
    const navigate = useNavigate();

    const fetchOperations = () => {
        setError(undefined);
        sendMediatorRequest({
            command: new ListOperations(),
            setBusy: setLoading,
            setError: setError,
            setState: setOperations
        });
    }
    useEffect(() => {

        fetchOperations();
    }, [props]);

    const handleCreateOperation = () => {
        navigate("/surveillance/operations/new");
    };

    useEffect(() => {
        console.log(error);
    }, [error]);
    if (error) {
        return (
            <ErrorView
                error={error}
                onRefresh={fetchOperations}
                customMessages={{
                    403: error403,
                    500: error500
                }}
            />
        );
    }
    

    return (
        <>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                </Box>
            ) : operations ? (
                <div className="space-y-6">
                    <div className="flex justify-end gap-2">
                        <button className="bg-[#313131] py-1 px-3 rounded-md text-white font-bold text-xl hover:bg-[#505050]"
                            onClick={handleCreateOperation}>+</button>
                        <div className="flex flex-col justify-center rounded-md gap-2">
                            <Typography className="!text-xs !font-semibold"> {createOperation}</Typography>
                        </div>
                    </div>
                    <OperationsTable operations={operations} />
                </div>
            ) : null
            }
        </>
    );
};