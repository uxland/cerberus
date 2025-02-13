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
import { IssueSummaryView, listIssues } from "../../features";
import { useEffect, useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

interface DataItem {
  date: string;
  totalEffort: number;
  totaIssues: number;
  issuesByType: { [key: string]: number };
  issuesByBrand: { [key: string]: number };
  effortByBrand: { [key: string]: number };
  effortByType: { [key: string]: number };
  issuesByBrandAndType: { [brand: string]: { [type: string]: number } };
  effortByBrandAndType: { [brand: string]: { [type: string]: number } };
}

export const OpenIssuesReportChart = () => {
  const [issues, setIssues] = useState<IssueSummaryView[]>(listIssues());
  const [brands, setBrands] = useState<string[]>([]);
  const [filterDescriptions, setFilterDescriptions] = useState<string[]>([]);
  const [dataItems, setDataItems] = useState<DataItem[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("Todas");
  const [selectedIssueType, setSelectedIssueType] = useState<string>("Todos");
  const [dynamicTicks, setDynamicTicks] = useState<number[]>([]);

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

    const nextDataItems: DataItem[] = issues.reduce((acc: DataItem[], issue: IssueSummaryView) => {
      let currentItem = acc.find((item) => item.date === issue.date);
      if (!currentItem) {
        currentItem = {
          date: issue.date,
          totaIssues: 0,
          totalEffort: 0,
          issuesByType: {},
          issuesByBrand: {},
          effortByType: {},
          effortByBrand: {},
          issuesByBrandAndType: {},
          effortByBrandAndType: {},
        };
        acc.push(currentItem);
      }
      currentItem.totaIssues = (currentItem.totaIssues || 0) + 1;
      currentItem.totalEffort = (currentItem.totalEffort || 0) + (issue.dedicatedEffort || 0);

      currentItem.issuesByType[issue.filterDescription] =
        (currentItem.issuesByType[issue.filterDescription] || 0) + 1;
      currentItem.issuesByBrand[issue.brandName] =
        (currentItem.issuesByBrand[issue.brandName] || 0) + 1;

      currentItem.effortByBrand[issue.brandName] =
        (currentItem.effortByBrand[issue.brandName] || 0) + (issue.dedicatedEffort || 0);
      currentItem.effortByType[issue.filterDescription] =
        (currentItem.effortByType[issue.filterDescription] || 0) + (issue.dedicatedEffort || 0);

      if (!currentItem.issuesByBrandAndType[issue.brandName]) {
        currentItem.issuesByBrandAndType[issue.brandName] = {};
      }
      currentItem.issuesByBrandAndType[issue.brandName][issue.filterDescription] =
        (currentItem.issuesByBrandAndType[issue.brandName][issue.filterDescription] || 0) + 1;

      if (!currentItem.effortByBrandAndType[issue.brandName]) {
        currentItem.effortByBrandAndType[issue.brandName] = {};
      }
      const currentEffort = currentItem.effortByBrandAndType[issue.brandName][issue.filterDescription] || 0;
      currentItem.effortByBrandAndType[issue.brandName][issue.filterDescription] = currentEffort + (issue.dedicatedEffort || 0);

      return acc;
    }, []);

    setDataItems(nextDataItems.reverse());
    console.log(nextDataItems, "nextDataItems");

    if (nextDataItems.length > 0) {
      const maxTotalEffort = Math.max(...nextDataItems.map(item => item.totalEffort));
      const suggestedTicks = calculateSuggestedTicks(0, maxTotalEffort);
      setDynamicTicks(suggestedTicks);
    }
  }, [issues]);


  const filteredDataItems = dataItems.map((item) => {
    const filteredItem = { ...item };
    const weekNumber = item.date.split("")[0];
    filteredItem.date = `Semana ${weekNumber}`;
    if (selectedBrand === "Todas" && selectedIssueType === "Todos") {
      filteredItem.totaIssues = item.totaIssues;
      filteredItem.totalEffort = item.totalEffort;
    } else if (selectedBrand === "Todas") {
      filteredItem.totaIssues = item.issuesByType[selectedIssueType] || 0;
      filteredItem.totalEffort = item.effortByType[selectedIssueType] || 0;
    } else if (selectedIssueType === "Todos") {
      filteredItem.totaIssues = item.issuesByBrand[selectedBrand] || 0;
      filteredItem.totalEffort = item.effortByBrand[selectedBrand] || 0;
    } else {
      filteredItem.totaIssues = item.issuesByBrandAndType[selectedBrand]?.[selectedIssueType] || 0;
      filteredItem.totalEffort = item.effortByBrandAndType[selectedBrand]?.[selectedIssueType] || 0;
    }
    return filteredItem;
  });

  useEffect(() => {
    if (filteredDataItems.length > 0) {
      const maxValue = Math.max(...filteredDataItems.map((item) => item.totalEffort));
      const suggestedTicks = calculateSuggestedTicks(0, maxValue);
      setDynamicTicks(suggestedTicks);
    }
  }, [filteredDataItems]);

  const calculateSuggestedTicks = (minValue: number, maxValue: number): number[] => {
    const range = maxValue - minValue;
    const tickCount = 5;
    const tickInterval = range / tickCount;
    const roundTo = 100;
    const ticks: number[] = [];

    for (let i = 0; i <= tickCount; i++) {
      const tickValue = minValue + i * tickInterval;
      ticks.push(Math.round(tickValue / roundTo) * roundTo);
    }

    return Array.from(new Set(ticks)).sort((a, b) => a - b);
  };
  return (
    <div className="flex flex-col gap-6 p-6 bg-tableBg rounded-[10px] w-auto">
      <div className="flex flex-col gap-6 h-[600px]">

        <div style={{ display: "flex", gap: "1rem" }}>
          <FormControl style={{ minWidth: 120 }}>
            <InputLabel id="brand-select-label">Marca</InputLabel>
            <Select
              labelId="brand-select-label"
              value={selectedBrand}
              label="Marca"
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <MenuItem value="Todas">Todas</MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{ minWidth: 120 }}>
            <InputLabel id="issue-type-select-label">Filtro</InputLabel>
            <Select
              labelId="issue-type-select-label"
              value={selectedIssueType}
              label="Tipo"
              onChange={(e) => setSelectedIssueType(e.target.value)}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              {Object.keys(
                dataItems.reduce((acc, item) => {
                  Object.keys(item.issuesByType).forEach((type) => (acc[type] = true));
                  return acc;
                }, {})
              ).map((type) => (
                <MenuItem key={type} value={type}>
                  {type === "blobs"
                    ? "Obstrucción"
                    : type === "blur"
                      ? "Desenfoque"
                      : type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <ResponsiveContainer width="100%">
          <BarChart
            data={filteredDataItems}
            barGap={12}
            barCategoryGap={15}
            maxBarSize={40}
            barSize={40}
          >
            <CartesianGrid />
            <XAxis
              dataKey="date"
              height={110}
              tickMargin={15}
              tick={{ fill: "#d7dadb" }}
            />
            <YAxis
              ticks={dynamicTicks}
              domain={[0, (dataMax) => dataMax * 1.1]}
              tick={{ fill: "#d7dadb" }}
            />
            <Legend align="right" width={500} content={<CustomizedLegend />} />
            <Bar dataKey="totaIssues" fill="#ff2366" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="totaIssues" content={<RenderCustomizedLabel />} />
            </Bar>
            <Bar dataKey="totalEffort" fill="#02bc77" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="totalEffort" content={<RenderCustomizedLabel />} />
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
        fontWeight={800}
        textAnchor="middle"
        dominantBaseline="middle"
        color="#d7dadb"
      >
        {value}
      </text>
    </g>
  );
};

const CustomizedLegend = (props) => {
  const { payload } = props;
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
      {payload.map((entry, index) => (
        <div
          key={`item-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            margin: "0 10px",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 32 32"
            style={{ marginRight: "5px", borderRadius: "50%" }}
          >
            <rect fill={entry.color} width="32" height="32" />
          </svg>
          <span style={{ color: "#d7dadb" }}>
            {entry.dataKey === "totaIssues"
              ? "Incidencias"
              : entry.dataKey === "totalEffort"
                ? "Esfuerzo (h)"
                : entry.dataKey}
          </span>
        </div>
      ))}
    </div>
  );
};