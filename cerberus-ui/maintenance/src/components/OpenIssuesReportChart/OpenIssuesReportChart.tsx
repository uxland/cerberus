import Typography from "@mui/material/Typography";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useMaintenanceLocales } from "../../locales/ca/locales";
import {IssueSummary, IssueSummaryView, listIssues} from "../../features";
import {useEffect, useState} from "react";

const data = [
  {
    name: "Week 1",
    opened: 117,
    closed: 67,
    hours: 147,
  },
  {
    name: "Week 2",
    opened: 98,
    closed: 60,
    hours: 100,
  },
  {
    name: "Week 3",
    opened: 60,
    closed: 35,
    hours: 80,
  },
  {
    name: "Week 4",
    opened: 145,
    closed: 96,
    hours: 180,
  },
  {
    name: "Week 5",
    opened: 88,
    closed: 54,
    hours: 120,
  },
  {
    name: "Week 6",
    opened: 64,
    closed: 44,
    hours: 85,
  },
  {
    name: "Week 7",
    opened: 120,
    closed: 79,
    hours: 111,
  },
];

interface DataItem{
    date: string;
    totalEffort: number;
    totaIssues: number;
    issuesByType: {[key: string]: number};
    issuesByBrand: {[key: string]: number};
    effortByBrand: {[key: string]: number};
    effortByType:{[key: string]: number};

}

export const OpenIssuesReportChart = () => {
  const [issues, setIssues] = useState<IssueSummaryView[]>(listIssues());
  const [brands, setBrands] = useState<string[]>([]);
  const [filterDescriptions, setFilterDescriptions] = useState<string[]>([]);
  const [dataItems, setDataItems] = useState<DataItem[]>([]);
  useEffect(() => {
    const brandNames = issues.reduce((acc: string[], issue: IssueSummaryView) => {
        if (!acc.includes(issue.brandName)) {
            acc.push(issue.brandName);
        }
        return acc;
    }, []);
    setBrands(brandNames);

    const filterDescriptions = issues.reduce((acc: string[], issue: IssueSummaryView) => {
        if (!acc.includes(issue.filterDescription)) {
            acc.push(issue.filterDescription);
        }
        return acc;
    }, []);
    setFilterDescriptions(filterDescriptions);

    const dataItems: DataItem[] = issues.reduce((acc: DataItem[], issue: IssueSummaryView) => {
      let  currentItem = acc.find((item) => item.date ===  issue.date);
      if(!currentItem){
        currentItem = {date: issue.date, totaIssues: 0, totalEffort: 0, issuesByType: {}, issuesByBrand: {}, effortByType: {}, effortByBrand: {}} as DataItem;
        acc.push(currentItem);
      }
      currentItem.totaIssues = (currentItem.totaIssues || 0) + 1;
      currentItem.totalEffort = (currentItem.totalEffort || 0) + (issue.dedicatedEffort || 0);
      currentItem.issuesByType[issue.filterDescription] = (currentItem.issuesByType[issue.filterDescription] || 0) + 1;
      currentItem.issuesByBrand[issue.brandName] = (currentItem.issuesByBrand[issue.brandName] || 0) + 1;
      currentItem.effortByBrand[issue.brandName] = (currentItem.effortByBrand[issue.brandName] || 0) + (issue.dedicatedEffort || 0);
      currentItem.effortByType[issue.filterDescription] = (currentItem.effortByType[issue.filterDescription] || 0) + (issue.dedicatedEffort || 0);
      return acc;
    }, []);
    setDataItems(dataItems);
  }, [issues]);
  return (
    <div className="flex flex-col gap-6 p-6 bg-tableBg rounded-[10px] w-auto">
      <div className="flex flex-col gap-6 h-[600px]">
        <Typography variant="h5">
          {useMaintenanceLocales("title.summaryChart")}
        </Typography>
        <ResponsiveContainer width="100%" >
          <BarChart
            data={data}
            barGap={12}
            barCategoryGap={15}
            maxBarSize={40}
            barSize={40}>
            <CartesianGrid />
            <XAxis
              dataKey="name"
              height={110}
              tickMargin={20}
              tick={{ fill: "#d7dadb" }}
            />
            <YAxis
              ticks={[0, 50, 100, 150, 200]}
              domain={[0, (dataMax) => dataMax * 1.1]}
              tickMargin={100}
              tick={{ fill: "#d7dadb" }}
            />
            <Legend align="right" width={500} content={<CustomizedLegend />} />
            <Bar dataKey="opened" fill="#ff2366" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="opened" content={<RenderCustomizedLabel />} />
            </Bar>
            <Bar dataKey="closed" fill="#02bc77" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="closed" content={<RenderCustomizedLabel />} />
            </Bar>
            <Bar dataKey="hours" fill="#ffd950" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="hours" content={<RenderCustomizedLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const RenderCustomizedLabel = (props: any) => {
  const { x, y, width, value } = props;

  return (
    <g style={{ filter: "drop-shadow(0px 0px 3px rgb(0 0 0 / 0.08))" }}>
      <text
        x={x + width / 2}
        y={y - 14}
        width={40}
        fill="white"
        fontSize="14px"
        textAnchor="middle"
        dominantBaseline="middle"
        color="#d7dadb">
        {value}
      </text>
    </g>
  );
};

const CustomizedLegend = (props) => {
  const { payload } = props;

  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
      {payload.map((entry, index) => (
        <div
          key={`item-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            margin: "0 10px",
          }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 32 32"
            style={{ marginRight: "5px", borderRadius: "50%" }}>
            <rect fill={entry.color} width="32" height="32" />
          </svg>
          <span style={{ color: "#d7dadb" }}>Total {entry.value}</span>
        </div>
      ))}
    </div>
  );
};
