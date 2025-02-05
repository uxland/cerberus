import BlurOnOutlinedIcon from "@mui/icons-material/BlurOnOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ViewCarouselOutlinedIcon from "@mui/icons-material/ViewCarouselOutlined";
import { TraingingReviewPerformanceItem } from "../TraingingReviewPerformanceItem/TraingingReviewPerformanceItem";

export const TrainingReviewsPerformanceList = () => {
  return (
    <div className="flex w-full justify-start items-center gap-6 flex-wrap overflow-x-auto overflow-y-hidden">
      <TraingingReviewPerformanceItem
        title={"Total errors"}
        icon={<ErrorOutlineOutlinedIcon className="kpi-icon error" />}
        currentSevenDays={"148"}
        previousSevenDays={"185"}
        percentage={"+10"}
        type={"error"}
      />
      <TraingingReviewPerformanceItem
        title={"Blur errors"}
        icon={<BlurOnOutlinedIcon className="kpi-icon" />}
        currentSevenDays={"148"}
        previousSevenDays={"185"}
        percentage={"+10"}
        type={"error"}
      />
      <TraingingReviewPerformanceItem
        title={"Blobs errors"}
        icon={<ViewCarouselOutlinedIcon className="kpi-icon" />}
        currentSevenDays={"148"}
        previousSevenDays={"185"}
        percentage={"+10"}
        type={"error"}
      />

    </div>
  );
};