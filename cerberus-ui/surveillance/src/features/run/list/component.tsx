import { React } from 'react';
import { RunsList } from './ui/runList';
import { ListRuns } from './query';

export const RunSummaryView = () => {
    return (
        <RunsList
            command={new ListRuns()}
            title="Todas las inspecciones"
        />
    );
};