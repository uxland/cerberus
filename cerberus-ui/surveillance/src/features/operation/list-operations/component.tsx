import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mediator } from "mediatr-ts";
import { ListOperations } from "./query.ts";
import { nop } from "@cerberus/core";
import { getOperationUrl, OperationSummary } from "./model.ts";
import { OperationsTable } from "../../../components/index.ts";

export const OperationsView = (props: { id: string }) => {
    const [operations, setOperations] = useState<OperationSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(undefined);
                const operations = await new Mediator().send(new ListOperations(props.id));
                setOperations(operations);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData().then(nop);
    }, [props]);

    const handleCreateOperation = () => {
        // Redirige a la ruta para crear una nueva operativa
        navigate("/surveillance/operations/new");
    };

    return (
        <div>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {operations && (
                <div>
                    <OperationsTable operations={operations} />
                </div>
            )}
            <div style={{ marginTop: 20 }}>
                <button onClick={handleCreateOperation}>
                    Crear nueva operativa
                </button>
            </div>
        </div>
    );
};