import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mediator } from "mediatr-ts";
import { ListRounds } from "./query.ts";
import { nop } from "@cerberus/core";
import { RoundSummary } from "./model.ts";
import { Typography } from "@mui/material";
import { RoundsTable } from "./components/component.tsx";

export const RoundsView = (props: { id: string }) => {
    const [rounds, setRounds] = useState<RoundSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            await new Mediator().send(new ListRounds(props.id, setRounds, setLoading, setError));
        }
        fetchData().then(nop);
    }, [props]);

    const handleCreateRound = () => {
        navigate("/surveillance/rounds/new");
    };

    return (
        <div className="space-y-6">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            <div className="flex justify-end gap-2">
                <button className="bg-primary py-1 px-3 rounded-md text-black font-bold text-xl hover:bg-formSelect" onClick={handleCreateRound}>+</button>
                <div className="flex flex-col justify-center rounded-md gap-2 mr-4">
                    <Typography className="!text-xs !font-semibold"> Anadir</Typography>
                    <Typography className="!text-xs !font-semibold"> Ronda</Typography>
                </div>
            </div>
            {rounds && (
                <div>
                    <RoundsTable rounds={rounds} />
                </div>
            )}
        </div>
    );
};