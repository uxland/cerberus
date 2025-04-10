import { CustomDivider } from "@cerberus/core";
import { Badge, SvgIcon, Typography } from "@mui/material";

export const OpenIssuesPerformanceItem = (props: {
  title: string;
  icon;
  currentSevenDays: string;
  previousSevenDays: string;
  percentage: string;
  type?: string;
}) => {
  return (
    <div className="flex flex-col h-30 items-center bg-tableBg w-full p-5 rounded-[10px] gap-4">
      <Typography className="!text-sm uppercase !font-semibold text-center">
        {props.title}
      </Typography>
      <div className="flex gap-4">
        <SvgIcon component={() => props.icon}></SvgIcon>
        <div className="flex gap-10">
          <div className="flex flex-col">
            <Typography>Actual</Typography>
            <div className="flex gap-2">
              <Typography className="!text-xl !font-semibold">
                {props.currentSevenDays}
              </Typography>
              <Badge
                className={`!text-sm ${props.type ? "text-error" : "text-success"
                  } `}>
                {props.percentage}%
              </Badge>
            </div>
          </div>
          <CustomDivider className="kpi-divider" />
          <div className="flex flex-col">
            <Typography className=" !text-grey82">
              Anterior (7 días)
            </Typography>
            <Typography className="!text-xl !text-grey82 !font-semibold">
              {props.previousSevenDays}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
