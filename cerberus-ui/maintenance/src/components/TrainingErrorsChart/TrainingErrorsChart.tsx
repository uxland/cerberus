import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Typography } from "@mui/material";
import { useMaintenanceLocales } from "../../locales/ca/locales";
import { FilterErrorView, getMockFilterErrors } from "../../features";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

interface DataItem {
  date: string;
  totalErrors: number;
  falsePositives: number;
  falseNegatives: number;
  errorsByType: Record<string, number>;
  falsePositivesByType: Record<string, number>;
  falseNegativesByType: Record<string, number>;
  errorsByBrand: Record<string, number>;
  falsePositivesByBrand: Record<string, number>;
  falseNegativesByBrand: Record<string, number>;
  errorsByBrandAndType: Record<string, Record<string, number>>;
  falsePositivesByBrandAndType: Record<string, Record<string, number>>;
  falseNegativesByBrandAndType: Record<string, Record<string, number>>;
}

export const TrainingErrorsChart = () => {
  const [selectedErrorTypes, setSelectedErrorTypes] = useState<string[]>([]);
  const [brandNames, setBrandNames] = useState<string[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<string>("Week");
  const [filterErrors, setFilterErrors] = useState<FilterErrorView[]>(
    getMockFilterErrors(selectedInterval)
  );
  const [dataItems, setDataItems] = useState<DataItem[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("Todas");
  const [selectedErrorType, setSelectedErrorType] = useState<string>("");
  const [dynamicTicks, setDynamicTicks] = useState<number[]>([]);
  const colors = {
    blobs: "#4791ff",
    blur: "#ffd950",
  };

  useEffect(() => {
    setFilterErrors(getMockFilterErrors(selectedInterval));
  }, [selectedInterval]);

  useEffect(() => {
    const filters = filterErrors.reduce((acc: string[], filter: FilterErrorView) => {
      if (!acc.includes(filter.filterDescription)) acc.push(filter.filterDescription);
      return acc;
    }, []);
    setSelectedErrorTypes(filters);

    const brands = filterErrors.reduce((acc: string[], filter) => {
      if (!acc.includes(filter.brandName)) acc.push(filter.brandName);
      return acc;
    }, []);
    setBrandNames(brands);

    const dataItems = filterErrors.reduce((acc: DataItem[], filter: FilterErrorView) => {
      let dataItem = acc.find((item) => item.date === filter.date);
      if (!dataItem) {
        dataItem = {
          date: filter.date,
          totalErrors: 0,
          falsePositives: 0,
          falseNegatives: 0,
          errorsByType: {},
          falsePositivesByType: {},
          falseNegativesByType: {},
          errorsByBrand: {},
          falsePositivesByBrand: {},
          falseNegativesByBrand: {},
          errorsByBrandAndType: {},
          falsePositivesByBrandAndType: {},
          falseNegativesByBrandAndType: {},
        } as DataItem;
        acc.push(dataItem);
      }
      dataItem.totalErrors = (dataItem.totalErrors || 0) + 1;
      dataItem.falsePositives =
        (dataItem.falsePositives || 0) + (filter.type === "False Positive" ? 1 : 0);
      dataItem.falseNegatives =
        (dataItem.falseNegatives || 0) + (filter.type === "False Negative" ? 1 : 0);
      dataItem.errorsByType[filter.filterDescription] =
        (dataItem.errorsByType[filter.filterDescription] || 0) + 1;
      dataItem.falsePositivesByType[filter.filterDescription] =
        (dataItem.falsePositivesByType[filter.filterDescription] || 0) +
        (filter.type === "False Positive" ? 1 : 0);
      dataItem.falseNegativesByType[filter.filterDescription] =
        (dataItem.falseNegativesByType[filter.filterDescription] || 0) +
        (filter.type === "False Negative" ? 1 : 0);
      dataItem.errorsByBrand[filter.brandName] = (dataItem.errorsByBrand[filter.brandName] || 0) + 1;
      dataItem.falsePositivesByBrand[filter.brandName] =
        (dataItem.falsePositivesByBrand[filter.brandName] || 0) +
        (filter.type === "False Positive" ? 1 : 0);
      dataItem.falseNegativesByBrand[filter.brandName] =
        (dataItem.falseNegativesByBrand[filter.brandName] || 0) +
        (filter.type === "False Negative" ? 1 : 0);

      if (!dataItem.errorsByBrandAndType[filter.brandName]) {
        dataItem.errorsByBrandAndType[filter.brandName] = {};
      }
      dataItem.errorsByBrandAndType[filter.brandName][filter.filterDescription] =
        (dataItem.errorsByBrandAndType[filter.brandName][filter.filterDescription] || 0) + 1;

      if (!dataItem.falsePositivesByBrandAndType[filter.brandName]) {
        dataItem.falsePositivesByBrandAndType[filter.brandName] = {};
      }
      dataItem.falsePositivesByBrandAndType[filter.brandName][filter.filterDescription] =
        (dataItem.falsePositivesByBrandAndType[filter.brandName][filter.filterDescription] || 0) +
        (filter.type === "False Positive" ? 1 : 0);

      if (!dataItem.falseNegativesByBrandAndType[filter.brandName]) {
        dataItem.falseNegativesByBrandAndType[filter.brandName] = {};
      }
      dataItem.falseNegativesByBrandAndType[filter.brandName][filter.filterDescription] =
        (dataItem.falseNegativesByBrandAndType[filter.brandName][filter.filterDescription] || 0) +
        (filter.type === "False Negative" ? 1 : 0);

      return acc;
    }, []);
    setDataItems(dataItems.reverse());

    console.log(dataItems, "dataItems");

    if (dataItems.length > 0) {
      const maxTotalErrors = Math.max(...dataItems.map(item => item.totalErrors));
      const suggestedTicks = calculateSuggestedTicks(0, maxTotalErrors);
      setDynamicTicks(suggestedTicks);
    }
  }, [filterErrors]);

  const toggleErrorType = (type: string) => {
    setSelectedErrorTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredDataItems = dataItems.slice(0, 3).map((item) => {
    const filteredItem = {
      ...item,
      totalErrors: 0,
      falsePositives: 0,
      falseNegatives: 0,
      errorsByType: {},
      falsePositivesByType: {},
      falseNegativesByType: {},
    };
    filteredItem.date = item.date;

    selectedErrorTypes.forEach((errorType) => {
      let errorCount = 0;
      let fpCount = 0;
      let fnCount = 0;

      if (selectedBrand === "Todas") {
        errorCount = item.errorsByType[errorType] ?? 0;
        fpCount = item.falsePositivesByType[errorType] ?? 0;
        fnCount = item.falseNegativesByType[errorType] ?? 0;
      } else {
        errorCount = item.errorsByBrandAndType[selectedBrand]?.[errorType] ?? 0;
        fpCount = item.falsePositivesByBrandAndType[selectedBrand]?.[errorType] ?? 0;
        fnCount = item.falseNegativesByBrandAndType[selectedBrand]?.[errorType] ?? 0;
      }

      filteredItem.errorsByType[errorType] = errorCount;
      filteredItem.falsePositivesByType[errorType] = fpCount;
      filteredItem.falseNegativesByType[errorType] = fnCount;
      filteredItem.totalErrors += errorCount;
      filteredItem.falsePositives += fpCount;
      filteredItem.falseNegatives += fnCount;
    });

    return filteredItem;
  });

  useEffect(() => {
    if (filteredDataItems.length > 0) {
      const maxTotalErrors = Math.max(...filteredDataItems.map(item => item.totalErrors));
      const suggestedTicks = calculateSuggestedTicks(0, maxTotalErrors);
      setDynamicTicks(suggestedTicks);
    }
  }, [filteredDataItems]);


  const calculateSuggestedTicks = (minValue: number, maxValue: number): number[] => {
    const range = maxValue - minValue;
    const tickCount = 5;
    const tickInterval = range / tickCount;
    const roundTo = 100;
    const ticks = [];

    for (let i = 0; i <= tickCount; i++) {
      const tickValue = minValue + i * tickInterval;
      ticks.push(Math.round(tickValue / roundTo) * roundTo);
    }

    const uniqueTicks = Array.from(new Set(ticks)).sort((a, b) => a - b);
    return uniqueTicks;
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-tableBg rounded-[10px]">
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
              {brandNames.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl style={{ minWidth: 120, marginLeft: "auto" }}>
            <InputLabel id="interval-select-label">Intervalo</InputLabel>
            <Select
              labelId="interval-select-label"
              value={selectedInterval}
              label="Intervalo"
              onChange={(e) => setSelectedInterval(e.target.value)}
            >
              <MenuItem value="Week">Semanal</MenuItem>
              <MenuItem value="Month">Mensual</MenuItem>
              <MenuItem value="Day">Diario</MenuItem>
            </Select>
          </FormControl>
        </div>

        <ResponsiveContainer width="100%">
          <BarChart
            data={filteredDataItems}
            barGap={50}
            barCategoryGap={12}
            maxBarSize={40}
            barSize={40}
          >
            <CartesianGrid />
            <XAxis
              dataKey="date"
              height={110}
              tickMargin={15}
              tick={<CustomXAxisTick x={undefined} y={undefined} payload={undefined} />}
            />
            <YAxis
              ticks={dynamicTicks}
              domain={[0, (dataMax) => dataMax * 1.1]}
              tick={{ fill: "#d7dadb" }}
            />
            {selectedErrorTypes.map((type, index) => (
              <React.Fragment key={type}>
                <Bar dataKey={`errorsByType.${type}`} stackId="errorsByType" fill={colors[type]}>
                  <LabelList dataKey={`errorsByType.${type}`} fill="black" fontWeight={800} />
                  {selectedErrorTypes.length === 1 || (index === selectedErrorTypes.length - 1) ? (
                    <LabelList
                      dataKey="totalErrors"
                      content={
                        <CustomTotalLabel x={undefined} y={undefined} width={10} value={undefined} />
                      }
                    />
                  ) : null}
                </Bar>
                <Bar
                  dataKey={`falsePositivesByType.${type}`}
                  stackId="falsePositives"
                  fill={colors[type]}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList dataKey={`falsePositivesByType.${type}`} fill="black" fontWeight={800} />
                  {selectedErrorTypes.length === 1 || (index === selectedErrorTypes.length - 1) ? (
                    <LabelList
                      dataKey="falsePositives"
                      content={
                        <CustomTotalLabel x={undefined} y={undefined} width={10} value={undefined} />
                      }
                    />
                  ) : null}
                </Bar>
                <Bar
                  dataKey={`falseNegativesByType.${type}`}
                  stackId="falseNegatives"
                  fill={colors[type]}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList dataKey={`falseNegativesByType.${type}`} fill="black" fontWeight={800} />
                  {selectedErrorTypes.length === 1 || (index === selectedErrorTypes.length - 1) ? (
                    <LabelList
                      dataKey="falseNegatives"
                      content={
                        <CustomTotalLabel x={undefined} y={undefined} width={10} value={undefined} />
                      }
                    />
                  ) : null}
                </Bar>
              </React.Fragment>
            ))}
            <Legend
              align="right"
              width={150}
              content={
                <CustomizedLegend
                  selectedErrorTypes={selectedErrorTypes}
                  colors={colors}
                  toggleErrorType={toggleErrorType}
                />
              }
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CustomXAxisTick = ({ x, y, payload }) => {
  if (!payload) return null;

  const week = payload.value;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-90}
        y={-14}
        dy={16}
        textAnchor="middle"
        fill="white"
        fontSize={14}
        fontWeight={600}
        fontFamily="sans-serif"
      >
        Total
      </text>
      <text
        x={0}
        y={-14}
        dy={16}
        textAnchor="middle"
        fill="white"
        fontSize={14}
        fontWeight={600}
        fontFamily="sans-serif"
      >
        Falso P
      </text>
      <text
        x={90}
        y={-14}
        dy={16}
        textAnchor="middle"
        fill="white"
        fontSize={14}
        fontWeight={600}
        fontFamily="sans-serif"
      >
        Falso N
      </text>
      <text
        x={0}
        y={14}
        dy={16}
        textAnchor="middle"
        fontSize={16}
        fontWeight={500}
        fill="#d7dadb"
        fontFamily="sans-serif"
      >
        {week}
      </text>
    </g>
  );
};

const CustomizedLegend = ({ selectedErrorTypes, colors, toggleErrorType }) => {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
      {Object.keys(colors).map((type) => (
        <div
          key={type}
          className="flex items-center"
          onClick={() => toggleErrorType(type)}
          style={{
            cursor: "pointer",
            opacity: selectedErrorTypes.includes(type) ? 1 : 0.3,
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
            <rect fill={colors[type]} width="32" height="32" />
          </svg>
          <span style={{ color: "#d7dadb", fontFamily: "Montserrat" }}>{type === 'blur' ? 'Desenfoque' : type === 'blobs' ? 'Obstrucción' : type}</span>
        </div>
      ))}
    </div>
  );
};

const CustomTotalLabel = ({ x, y, width, value }) => (
  <text x={x + width / 2} y={y - 20} textAnchor="middle" fill="white" fontWeight={800}>
    {value}
  </text>
);