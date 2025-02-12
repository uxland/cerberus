import {CustomDivider} from "@cerberus/core";
import Badge from "@mui/material/Badge";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";

export const TraingingReviewPerformanceItem = (props: {
  title: string;
  icon;
  currentSevenDays: string;
  previousSevenDays: string;
  percentage: string;
  type?: string;
}) => {
  return (
    <div className="flex flex-col items-center bg-tableBg  p-4 rounded-[10px] gap-4 h-40 w-full lg:w-96">
      <Typography className="!text-[12px] uppercase !font-semibold">
        {props.title}
      </Typography>
      <div className="flex gap-4">
        <SvgIcon component={() => props.icon}></SvgIcon>
        <div className="flex gap-10">
          <div className="flex flex-col">
            <Typography>Current</Typography>
            <div className="flex flex-col gap-2">
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
              <div className="flex flex-col">
                <Typography className="!text-xs">
                  <span className="!font-bold text-error">
                    {props.currentSevenDays}
                  </span>{" "}
                  F. positive
                </Typography>
                <Typography className="!text-xs">
                  <span className="!font-bold text-error">
                    {props.currentSevenDays}
                  </span>{" "}
                  F. negative
                </Typography>
              </div>
            </div>
          </div>
          <CustomDivider className="kpi-divider" />
          <div className="flex flex-col">
            <div className="flex flex-col mt-1">
              <Typography className="!text-xs !text-grey82">
                Previous (7 days)
              </Typography>
              <Typography className="!text-lg !text-grey82">
                {props.previousSevenDays}
              </Typography>
            </div>
            <div className="flex flex-col mt-3">
              <Typography className="!text-[10px] !text-grey82">
                <span className="!font-bold text-error">
                  {props.currentSevenDays}
                </span>{" "}
                F. positive
              </Typography>
              <Typography className="!text-[10px] !text-grey82">
                <span className="!font-bold text-error">
                  {props.currentSevenDays}
                </span>{" "}
                F. negative
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
