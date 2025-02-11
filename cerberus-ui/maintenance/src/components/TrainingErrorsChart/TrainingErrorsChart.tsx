import React, {useEffect, useState} from "react";
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
import {FilterErrorView, getMockFilterErrors} from "../../features";

const data = [
  {
    name: "Week 1",
    errorByTypeTotals: 110,
    falsePositivesTotals: 50,
    falseNegativesTotals: 60,
    errorsByType: { blobs: 70, blur: 40 },
    falsePositives: { blobs: 30, blur: 20 },
    falseNegatives: { blobs: 40, blur: 20 },
  },
  {
    name: "Week 2",
    errorByTypeTotals: 130,
    falsePositivesTotals: 50,
    falseNegativesTotals: 70,
    errorsByType: { blobs: 80, blur: 50 },
    falsePositives: { blobs: 35, blur: 15 },
    falseNegatives: { blobs: 45, blur: 25 },
  },
  {
    name: "Week 3",
    errorByTypeTotals: 150,
    falsePositivesTotals: 65,
    falseNegativesTotals: 85,
    errorsByType: { blobs: 90, blur: 60 },
    falsePositives: { blobs: 40, blur: 25 },
    falseNegatives: { blobs: 50, blur: 35 },
  },
];


//const filterErrors =  getMockFilterErrors();

//const filterErrors = getMockFilterErrors();

interface DataItem{
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
}

export const TrainingErrorsChart = () => {
  const [selectedErrorTypes, setSelectedErrorTypes] = useState<string[]>([]);
  const [brandNames, setBrandNames] = useState<string[]>([]);
  const [filterErrors, setFilterErrors] = useState<FilterErrorView[]>(getMockFilterErrors());
  const [dataItems, setDataItems] = useState<DataItem[]>([]);
  const colors = {
    blobs: "#4791ff",
    blur: "#ffd950",
  };
  useEffect(() =>{
    const filters =  filterErrors.reduce((acc: string[], filter: FilterErrorView) => {
      if(!acc.includes(filter.filterDescription))
        acc.push(filter.filterDescription);
        return acc;
    }, []);
    setSelectedErrorTypes(filters);

    const brands = filterErrors.reduce((acc: string[], filter) => {
      if(!acc.includes(filter.brandName))
        acc.push(filter.brandName);
        return acc;
    }, []);
    setBrandNames(brands);

    const dataItems = filterErrors.reduce((acc: DataItem[], filter: FilterErrorView) => {
      let dataItem = acc.find((item) => item.date === filter.date);
      if(!dataItem){
        dataItem = {date: filter.date, totalErrors: 0, falsePositives: 0, falseNegatives: 0, errorsByType: {}, falsePositivesByType: {}, falseNegativesByType: {}, errorsByBrand: {}, falsePositivesByBrand: {}, falseNegativesByBrand: {}} as DataItem;
        acc.push(dataItem);
      }
      dataItem.totalErrors = (dataItem.totalErrors || 0) + 1;
      dataItem.falsePositives = (dataItem.falsePositives || 0) + (filter.errorType === "False Positive" ? 1 : 0);
      dataItem.falseNegatives = (dataItem.falseNegatives || 0) + (filter.errorType === "False Negative" ? 1 : 0);
      dataItem.errorsByType[filter.filterDescription] = (dataItem.errorsByType[filter.filterDescription] || 0) + 1;
      dataItem.falsePositivesByType[filter.filterDescription] = (dataItem.falsePositivesByType[filter.filterDescription] || 0) + (filter.errorType === "False Positive" ? 1 : 0);
      dataItem.falseNegativesByType[filter.filterDescription] = (dataItem.falseNegativesByType[filter.filterDescription] || 0) + (filter.errorType === "False Negative" ? 1 : 0);
      dataItem.errorsByBrand[filter.brandName] = (dataItem.errorsByBrand[filter.brandName] || 0) + 1;
      dataItem.falsePositivesByBrand[filter.brandName] = (dataItem.falsePositivesByBrand[filter.brandName] || 0) + (filter.errorType === "False Positive" ? 1 : 0);
      dataItem.falseNegativesByBrand[filter.brandName] = (dataItem.falseNegativesByBrand[filter.brandName] || 0) + (filter.errorType === "False Negative" ? 1 : 0);
      return acc;
    }, []);
    setDataItems(dataItems);
  }, [filterErrors]);

  const errorTypes = Object.keys(data[0].errorsByType);

  const toggleErrorType = (type: string) => {
    setSelectedErrorTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const selectAllErrorTypes = () => {
    setSelectedErrorTypes(errorTypes);
  };

  const deselectAllErrorTypes = () => {
    setSelectedErrorTypes([]);
  };

  const isAllSelected = errorTypes.length === selectedErrorTypes.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      deselectAllErrorTypes();
    } else {
      selectAllErrorTypes();
    }
  };

  const filteredData = data.map((item) => {
    const errorsByType = selectedErrorTypes.reduce((acc, type) => {
      acc[type] = item.errorsByType[type];
      return acc;
    }, {} as Record<string, number>);

    const calculatedErrorByTypeTotals = selectedErrorTypes.reduce(
      (sum, type) => sum + (item.errorsByType[type] || 0),
      0
    );

    const falsePositives = selectedErrorTypes.reduce((acc, type) => {
      acc[type] = item.falsePositives[type];
      return acc;
    }, {} as Record<string, number>);

    const calculatedFalsePositivesTotals = selectedErrorTypes.reduce(
      (sum, type) => sum + (item.falsePositives[type] || 0),
      0
    );

    const falseNegatives = selectedErrorTypes.reduce((acc, type) => {
      acc[type] = item.falseNegatives[type];
      return acc;
    }, {} as Record<string, number>);

    const calculatedFalseNegativesTotals = selectedErrorTypes.reduce(
      (sum, type) => sum + (item.falseNegatives[type] || 0),
      0
    );

    return {
      ...item,
      errorsByType,
      calculatedErrorByTypeTotals,
      falsePositives,
      calculatedFalsePositivesTotals,
      falseNegatives,
      calculatedFalseNegativesTotals,
    };
  });

  return (
    <div className="flex flex-col gap-6 p-6 bg-tableBg rounded-[10px]">
      <div className="flex flex-col gap-6 h-[600px]">
        <Typography variant="h5">
          {useMaintenanceLocales("title.errorsChart")}
        </Typography>
        <ResponsiveContainer width="100%">
          <BarChart
            data={filteredData}
            barGap={50}
            barCategoryGap={12}
            maxBarSize={40}
            barSize={40}
          >
            <CartesianGrid />
            <XAxis
              dataKey="name"
              height={110}
              tickMargin={20}
              tick={
                <CustomXAxisTick
                  x={undefined}
                  y={undefined}
                  payload={undefined}
                />
              }
            />
            <YAxis
              ticks={[0, 25, 50, 75, 100, 125, 150]}
              domain={[0, (dataMax) => dataMax * 1.1]}
              tick={{ fill: "#d7dadb" }}
            />
            {selectedErrorTypes.map((type) => (
              <>
                <Bar
                  key={`errorsByType-${type}`}
                  dataKey={`errorsByType.${type}`}
                  stackId="errorsByType"
                  fill={colors[type]}
                >
                  <LabelList
                    dataKey={`errorsByType.${type}`}
                    fill="black"
                    fontWeight={800}
                  />
                  <LabelList
                    dataKey={"calculatedErrorByTypeTotals"}
                    content={
                      <CustomTotalLabel
                        x={undefined}
                        y={undefined}
                        width={10}
                        value={undefined}
                      />
                    }
                  />
                </Bar>
                <Bar
                  key={`falsePositives-${type}`}
                  dataKey={`falsePositives.${type}`}
                  stackId="falsePositives"
                  fill={colors[type]}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList
                    dataKey={`falsePositives.${type}`}
                    fill="black"
                    fontWeight={800}
                  />
                  <LabelList
                    dataKey={"calculatedFalsePositivesTotals"}
                    content={
                      <CustomTotalLabel
                        x={undefined}
                        y={undefined}
                        width={10}
                        value={undefined}
                      />
                    }
                  />
                </Bar>
                <Bar
                  key={`falseNegatives-${type}`}
                  dataKey={`falseNegatives.${type}`}
                  stackId="falseNegatives"
                  fill={colors[type]}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList
                    dataKey={`falseNegatives.${type}`}
                    fill="black"
                    fontWeight={800}
                  />
                  <LabelList
                    dataKey={"calculatedFalseNegativesTotals"}
                    content={
                      <CustomTotalLabel
                        x={undefined}
                        y={undefined}
                        width={10}
                        value={undefined}
                      />
                    }
                  />
                </Bar>
              </>
            ))}
            <Legend align="right" width={150} content={<CustomizedLegend selectedErrorTypes={selectedErrorTypes} colors={colors} toggleErrorType={toggleErrorType} />} />
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
        fontFamily="Montserrat"
      >
        Total E.
      </text>
      <text
        x={0}
        y={-14}
        dy={16}
        textAnchor="middle"
        fill="white"
        fontSize={14}
        fontWeight={600}
        fontFamily="Montserrat"
      >
        False P.
      </text>
      <text
        x={90}
        y={-14}
        dy={16}
        textAnchor="middle"
        fill="white"
        fontSize={14}
        fontWeight={600}
        fontFamily="Montserrat"
      >
        False N.
      </text>
      <text
        x={0}
        y={14}
        dy={16}
        textAnchor="middle"
        fill="white"
        fontFamily="Montserrat"
      >
        {week}
      </text>
    </g>
  );
};

const CustomizedLegend = ({ selectedErrorTypes, colors, toggleErrorType }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
      {Object.keys(colors).map((type) => (
        <div
          key={type}
          className="flex items-center"
          onClick={() => toggleErrorType(type)}
          style={{ cursor: "pointer", opacity: selectedErrorTypes.includes(type) ? 1 : 0.3 }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 32 32"
            style={{ marginRight: "5px", borderRadius: "50%" }}
          >
            <rect fill={colors[type]} width="32" height="32" />
          </svg>
          <span style={{ color: "#d7dadb", fontFamily: "Montserrat" }}>{type}</span>
        </div>
      ))}
    </div>
  );
};

const CustomTotalLabel = ({ x, y, width, value }) => (
  <text
    x={x + width / 2}
    y={y - 20}
    textAnchor="middle"
    fill="white"
    fontWeight={800}
  >
    {value}
  </text>
);