import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mediator } from "mediatr-ts";
import { ListOperations } from "./query.ts";
import { nop } from "@cerberus/core";
import { getOperationUrl, OperationSummary } from "./model.ts";
import { OperationsTable } from "../../../components/index.ts";
import { Typography, Box, CircularProgress } from "@mui/material";

export const OperationsView = (props: { id: string }) => {
    const [operations, setOperations] = useState<OperationSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            await new Mediator().send(new ListOperations(setOperations, setLoading, setError))
        }
        fetchData().then(nop);
    }, [props]);

    const handleCreateOperation = () => {
        navigate("/surveillance/operations/new");
    };

    return (
        <div >
            {loading ? (
                <Box className="flex justify-center items-center">
                    <CircularProgress />
                </Box>
            ) : operations ? (
                <div className="space-y-6">
                    <div className="flex justify-end gap-2">
                        <button className="bg-[#313131] py-1 px-3 rounded-md text-white font-bold text-xl hover:bg-[#505050]"
                            onClick={handleCreateOperation}>+</button>
                        <div className="flex flex-col justify-center rounded-md gap-2">
                            <Typography className="!text-xs !font-semibold"> Anadir</Typography>
                            <Typography className="!text-xs !font-semibold"> Operativa</Typography>

                        </div>
                    </div>
                    <OperationsTable operations={operations} />
                </div>
            ) : null
            }
            {error && <div>Error: {String(error)}</div>}

        </div>
    );
};