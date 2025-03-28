import { React } from 'react';
import { ListRunsByLocation } from './query';
import { RunsList } from '../ui/runList';

export const LocationRunsView = (props: { id: string }) => {
    return (
        <RunsList
            command={props.id ? new ListRunsByLocation(props.id) : null}
        />
    );
};