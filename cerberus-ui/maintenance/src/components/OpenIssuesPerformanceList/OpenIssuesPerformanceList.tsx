import AccessAlarmsOutlinedIcon from "@mui/icons-material/AccessAlarmsOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { OpenIssuesPerformanceItem } from "../OpenIssuesPerformanceItem/OpenIssuesPerformanceItem";

export const OpenIssuesPerformanceList = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="grid lg:grid-cols-2 2xl:grid-cols-4 gap-6 w-full ">
        <OpenIssuesPerformanceItem
          title={"Incidencias abiertas (7 días)"}
          icon={<ErrorOutlineOutlinedIcon className="kpi-icon error" />}
          currentSevenDays={"148"}
          previousSevenDays={"185"}
          percentage={"+10"}
          type={"error"}
        />
        <OpenIssuesPerformanceItem
          title={"Incidencias cerradas (7 días)"}
          icon={<CheckCircleOutlinedIcon className="kpi-icon success" />}
          currentSevenDays={"180"}
          previousSevenDays={"112"}
          percentage={"10"}
        />
        <OpenIssuesPerformanceItem
          title={"Esfuerzo total en horas (7 días)"}
          icon={<AccessAlarmsOutlinedIcon className="kpi-icon warning" />}
          currentSevenDays={"180"}
          previousSevenDays={"185"}
          percentage={"10"}
        />
        <OpenIssuesPerformanceItem
          title={"Esfuerzo promedio en horas (7 días)"}
          icon={<AccessAlarmsOutlinedIcon className="kpi-icon info" />}
          currentSevenDays={"1,78"}
          previousSevenDays={"1,13"}
          percentage={"10"}
        />
      </div>
    </div>
  );
};