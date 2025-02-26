import { nop } from "@cerberus/core";
import { Mediator } from "mediatr-ts";
import { useEffect, useState } from "react";
import { PendingReviewTable } from "../../../components/index.ts";
import { TrainingErrorsChart } from "../components/TrainingErrorsChart.tsx";
import { TrainingReviewsPerformanceList } from "../components/TrainingReviewsPerformanceList.tsx";
import { PendingTrainingReview } from "./model.ts";
import { ListPendingReviewsByLocation } from "./query.ts";
import { Tabs, Tab, Box, CircularProgress } from "@mui/material";
import { useMaintenanceLocales } from "../../../locales/ca/locales.ts";

export const PendingTrainingReviewsView = (props: { id: string }) => {
  const [reviews, setReviews] = useState<PendingTrainingReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const tab1 = useMaintenanceLocales(
    "pendingReviewsTabs.table",
  );
  const tab2 = useMaintenanceLocales(
    "pendingReviewsTabs.chart",
  );

  useEffect(() => {
    async function fetchReviews() {
      try {
        setError(undefined);
        setLoading(true);
        const reviews = await new Mediator().send(
          new ListPendingReviewsByLocation(props.id)
        );
        setReviews(reviews);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews().then(nop);
  }, [props]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : reviews ? (
        <Box sx={{ width: "100%" }}>
          <TrainingReviewsPerformanceList />
          <Tabs value={selectedTab} onChange={handleChange} aria-label="open-issues-tabs" style={{ marginTop: "20px", marginBottom: "20px" }}>
            <Tab label={tab1} {...a11yProps(0)} />
            <Tab label={tab2} {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={selectedTab} index={0}>
            <PendingReviewTable reviews={reviews} />
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <TrainingErrorsChart />
          </TabPanel>
        </Box>
      ) : null}
      {error && <div>Error: {error}</div>}
    </div>
  );
};


const TabPanel = (props: { children?: React.ReactNode; value: number; index: number }) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`open-issues-tabpanel-${index}`}
      aria-labelledby={`open-issues-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `open-issues-tab-${index}`,
    "aria-controls": `open-issues-tabpanel-${index}`,
  };
};