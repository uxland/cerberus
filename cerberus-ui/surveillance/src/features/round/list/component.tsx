import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListRounds } from "./query.ts";
import { ErrorView } from "@cerberus/core";
import { RoundSummary } from "./model.ts";
import { Typography, Box, CircularProgress } from "@mui/material";
import { RoundsTable } from "./components/component.tsx";
import { sendMediatorRequest } from "@cerberus/core";
import { useSurveillanceLocales } from "../../../locales/ca/locales.ts";
import { AxiosError } from "axios";

export const RoundsView = (props: { id: string }) => {
    const error403 = useSurveillanceLocales("round.errors.list.403");
    const error500 = useSurveillanceLocales("round.errors.list.500");
    const createRound = useSurveillanceLocales("round.create.createRound");

    const [rounds, setRounds] = useState<RoundSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AxiosError>(undefined);
    const navigate = useNavigate();

    const fetchRounds = () => {
        setError(undefined);
        sendMediatorRequest({
            command: new ListRounds(props.id),
            setBusy: setLoading,
            setError: setError,
            setState: setRounds
        });
    }


    useEffect(() => {
        fetchRounds();
    }, [props]);

    const handleCreateRound = () => {
        navigate(`/surveillance/locations/${props.id}/rounds/new`);
    };


    if (error) {
        return (
            <ErrorView
                error={error}
                onRefresh={fetchRounds}
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
            ) : rounds ? (
                <div className="space-y-6">
                    <div className="flex justify-end gap-2">
                        <button className="bg-primary py-1 px-3 rounded-md text-black font-bold text-xl hover:bg-formSelect" onClick={handleCreateRound}>+</button>
                        <div className="flex flex-col justify-center rounded-md gap-2 mr-4">
                            <Typography className="!text-xs !font-semibold"> {createRound}</Typography>
                        </div>
                    </div>
                    <RoundsTable rounds={rounds} />
                </div>
            ) : null
            }
        </>
    );
};