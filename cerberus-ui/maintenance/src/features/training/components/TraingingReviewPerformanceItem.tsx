import { CustomDivider } from "@cerberus/core";
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
    <div className="flex flex-col items-center bg-tableBg p-4 rounded-[10px] gap-4 w-full lg:w-96">
      <Typography className="!text-sm uppercase !font-semibold text-center">
        {props.title}
      </Typography>

      <div className="flex gap-4 items-start">
        <SvgIcon component={() => props.icon} fontSize="medium" />

        <div className="flex gap-6">
          <div className="flex flex-col">
            <Typography className="!text-sm font-semibold mb-1">
              Actual
            </Typography>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Typography className="!text-xl !font-semibold">
                  {props.currentSevenDays}
                </Typography>
                <Badge
                  className={`!text-sm px-2 py-1 rounded ${props.type ? "text-error" : "text-success"
                    }`}
                >
                  {props.percentage}%
                </Badge>
              </div>
              <div className="flex flex-col">
                <Typography className="!text-sm">
                  <span className="!font-bold text-error">
                    {props.currentSevenDays}
                  </span>{" "}
                  F. positivo
                </Typography>
                <Typography className="!text-sm">
                  <span className="!font-bold text-error">
                    {props.currentSevenDays}
                  </span>{" "}
                  F. negativo
                </Typography>
              </div>
            </div>
          </div>

          <CustomDivider className="kpi-divider" />

          <div className="flex flex-col">
            <Typography className="!text-sm !text-grey82 font-semibold mb-1">
              Anterior (7 días)
            </Typography>
            <Typography className="!text-xl !font-semibold !text-grey82">
              {props.previousSevenDays}
            </Typography>
            <div className="flex flex-col mt-2 gap-1">
              <Typography className="!text-sm !text-grey82">
                <span className="!font-bold text-error">
                  {props.currentSevenDays}
                </span>{" "}
                F. positivo
              </Typography>
              <Typography className="!text-sm !text-grey82">
                <span className="!font-bold text-error">
                  {props.currentSevenDays}
                </span>{" "}
                F. negativo
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};