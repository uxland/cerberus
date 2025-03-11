import {ExecutionStepArgs} from "../model.ts";
import {Box, Button} from "@mui/material";
import {StartRun} from "./command.ts";
import {useSurveillanceLocales} from "../../../../locales/ca/locales.ts";

export interface StartSurveillanceRunProps extends ExecutionStepArgs {
    runId: string;
}

export const StartSurveillanceRun = (props: StartSurveillanceRunProps) => {
    const startButtonTitle = useSurveillanceLocales('run.set.start');
    const handleStart = () => props.handler(new StartRun(props.runId))
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh" flexDirection="column" gap={2}>
            <Button variant="contained" color="primary" onClick={handleStart}>
                {startButtonTitle}
            </Button>
        </Box>
    )
}