import { React } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { ListRunsByRound } from './query';
import { RunsList } from '../ui/runList';

export const RoundRunsView = () => {
    const { roundId, locationId } = useParams();

    const headerContent = (
        <div className="flex items-center gap-2 bg-tableBg py-3 px-6 rounded-[10px] w-full flex-shrink-0">
            <Typography className="uppercase !text-primary !font-semibold">{roundId}</Typography>
        </div>
    );

    return (
        <RunsList
            command={roundId ? new ListRunsByRound(roundId) : null}
            title="Llistat"
            headerContent={headerContent}
        />
    );
};