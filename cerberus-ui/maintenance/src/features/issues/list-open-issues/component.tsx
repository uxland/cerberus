import { nop } from "@cerberus/core";
import { Mediator } from "mediatr-ts";
import { useEffect, useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import {
  OpenIssuesPerformanceList,
  OpenIssuesReportChart,
  OpenIssuesTable,
} from "../../../components/index.ts";
import { useMaintenanceLocales } from "../../../locales/ca/locales";
import { RoundInspectionView } from "./Pruebas/testform.tsx";
import { MaintenanceIssueSummary } from "./model.ts";
import { ListOpenIssues } from "./query.ts";

export const OpenIssuesView = (props: { id: string }) => {
  const [issues, setIssues] = useState<MaintenanceIssueSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const [selectedTab, setSelectedTab] = useState<Number>(0);

  const tab1 = useMaintenanceLocales(
    "openIssuesTabs.table",
  );
  const tab2 = useMaintenanceLocales(
    "openIssuesTabs.chart",
  );
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(undefined);
        const issues = await new Mediator().send(new ListOpenIssues(props.id));
        setIssues(issues);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData().then(nop);
  }, [props]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {issues && (
        <Box sx={{ width: "100%" }}>
          <OpenIssuesPerformanceList />
          <Tabs value={selectedTab} onChange={handleChange} aria-label="open-issues-tabs" style={{ marginTop: "20px", marginBottom: "20px" }}>
            <Tab label={tab1} {...a11yProps(0)} />
            <Tab label={tab2} {...a11yProps(1)} />
            <Tab label={"Pruebas"} {...a11yProps(2)} />
          </Tabs>
          <TabPanel value={selectedTab} index={0}>
            <OpenIssuesTable issues={issues} />
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <OpenIssuesReportChart />
          </TabPanel>
          <TabPanel value={selectedTab} index={2}>
            <RoundInspectionView />
          </TabPanel>
        </Box>
      )}
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