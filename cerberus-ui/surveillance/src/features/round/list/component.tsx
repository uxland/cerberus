import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListRounds } from "./query.ts";
import { nop } from "@cerberus/core";
import { RoundSummary } from "./model.ts";
import { Typography, Box, CircularProgress } from "@mui/material";
import { RoundsTable } from "./components/component.tsx";
import { sendMediatorRequest } from "@cerberus/core";

export const RoundsView = (props: { id: string }) => {
    const [rounds, setRounds] = useState<RoundSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchRounds() {
            sendMediatorRequest({
                command: new ListRounds(props.id),
                setBusy: setLoading,
                setError: setError,
                setState: setRounds
            });
        }
        fetchRounds().then(nop);
    }, [props]);

    const handleCreateRound = () => {
        navigate(`/surveillance/locations/${props.id}/rounds/new`);
    };

    return (
        <div >
            {loading ? (
                <Box className="flex justify-center items-center">
                    <CircularProgress />
                </Box>
            ) : rounds ? (
                <div className="space-y-6">
                    <div className="flex justify-end gap-2">
                        <button className="bg-primary py-1 px-3 rounded-md text-black font-bold text-xl hover:bg-formSelect" onClick={handleCreateRound}>+</button>
                        <div className="flex flex-col justify-center rounded-md gap-2 mr-4">
                            <Typography className="!text-xs !font-semibold"> Anadir</Typography>
                            <Typography className="!text-xs !font-semibold"> Ronda</Typography>
                        </div>
                    </div>
                    <RoundsTable rounds={rounds} />
                </div>
            ) : null
            }
            {error && <div>Error: {error}</div>}

        </div>
    );
};