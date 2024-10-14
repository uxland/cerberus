import {IconButton, Typography} from "@mui/material";
import React from "react";

interface FilterItemProps {
  filter: any;
  index: number;
  handleCalibration: (index: number) => void;
  filterTextLabel: string;
  calibrateLabel: string;
}

export const MaintenanceFilterSettingsItem: React.FC<FilterItemProps> = ({
  filter,
  index,
  handleCalibration,
  filterTextLabel,
  calibrateLabel,
}) => {
  return (
    <div key={index}>
      <div className="flex gap-2 items-center">
        <Typography>
          {filterTextLabel}:{" "}
          {filter.description.charAt(0).toUpperCase() +
            filter.description.slice(1)}{" "}
          :
        </Typography>
        <div className="flex gap-2">
          {Object.keys(filter.args).map((argKey, idx) => (
            <Typography key={argKey}>
              {argKey}: {filter.args[argKey]}{" "}
              {idx < Object.keys(filter.args).length - 1 ? "|" : ""}
            </Typography>
          ))}
        </div>
        <div className="flex ml-2">
          <IconButton onClick={() => handleCalibration(index)}>
            <Typography color={"primary"}>{calibrateLabel}</Typography>
          </IconButton>
        </div>
      </div>
    </div>
  );
};
