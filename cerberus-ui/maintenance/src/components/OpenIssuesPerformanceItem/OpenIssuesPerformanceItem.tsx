import {CustomDivider} from "@cerberus/core";
import {Badge, SvgIcon, Typography} from "@mui/material";

export const OpenIssuesPerformanceItem = (props: {
  title: string;
  icon;
  currentSevenDays: string;
  previousSevenDays: string;
  percentage: string;
  type?: string;
}) => {
  return (
    <div className="flex flex-col h-30 justify-between bg-tableBg w-96 p-5 rounded-[10px] gap-4">
      <Typography className="!text-[12px] uppercase !font-semibold">
        {props.title}
      </Typography>
      <div className="flex gap-4">
        <SvgIcon component={() => props.icon}></SvgIcon>
        <div className="flex gap-10">
          <div className="flex flex-col">
            <Typography>Current</Typography>
            <div className="flex gap-2">
              <Typography className="!text-2xl">
                {props.currentSevenDays}
              </Typography>
              <Badge
                className={`!text-sm ${
                  props.type ? "text-error" : "text-success"
                } `}>
                {props.percentage}%
              </Badge>
            </div>
          </div>
          <CustomDivider className="kpi-divider" />
          <div className="flex flex-col mt-1">
            <Typography className="!text-xs !text-grey82">
              Previous (7 days)
            </Typography>
            <Typography className="!text-lg !text-grey82">
              {props.previousSevenDays}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
