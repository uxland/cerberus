import {Typography} from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import {useMaintenanceLocales} from '../../locales/ca/locales';

const data = [
  {
    name: 'Week 1',
    totals: {blobs: 70, blur: 40},
    falsePositives: {blobs: 30, blur: 20},
    falseNegatives: {blobs: 40, blur: 20},
  },
  {
    name: 'Week 2',
    totals: {blobs: 80, blur: 50},
    falsePositives: {blobs: 35, blur: 15},
    falseNegatives: {blobs: 45, blur: 25},
  },
  {
    name: 'Week 3',
    totals: {blobs: 90, blur: 60},
    falsePositives: {blobs: 40, blur: 25},
    falseNegatives: {blobs: 50, blur: 35},
  },
];

export const TrainingErrorsChart = () => {
  return (
    <div className='flex flex-col gap-6 p-6 bg-tableBg rounded-[10px]'>
      <div className='flex flex-col gap-6'>
        <Typography variant='h5'>
          {useMaintenanceLocales('title.errorsChart')}
        </Typography>
        <ResponsiveContainer width='100%' height={600}>
          <BarChart
            data={data}
            barGap={50}
            barCategoryGap={12}
            maxBarSize={40}
            barSize={40}>
            <CartesianGrid />
            <XAxis
              dataKey='name'
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
              ticks={[0, 25, 50, 75, 100]}
              domain={[0, (dataMax) => dataMax * 1.1]}
              tickMargin={100}
              tick={{fill: '#d7dadb'}}
            />

            <Bar dataKey='totals.blobs' stackId='totals' fill='#ffd950'>
              <LabelList dataKey='totals.blobs' fill='black' fontWeight={800} />
            </Bar>
            <Bar
              dataKey='totals.blur'
              stackId='totals'
              fill='#4791ff'
              radius={[4, 4, 0, 0]}>
              <LabelList dataKey='totals.blur' fill='black' fontWeight={800} />
            </Bar>

            <Bar
              dataKey='falsePositives.blobs'
              stackId='falsePositives'
              fill='#ffd950'>
              <LabelList
                dataKey='falsePositives.blobs'
                fill='black'
                fontWeight={800}
              />
            </Bar>
            <Bar
              dataKey='falsePositives.blur'
              stackId='falsePositives'
              fill='#4791ff'
              radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey='falsePositives.blur'
                fill='black'
                fontWeight={800}
              />
            </Bar>

            <Bar
              dataKey='falseNegatives.blobs'
              stackId='falseNegatives'
              fill='#ffd950'>
              <LabelList
                dataKey='falseNegatives.blobs'
                fill='black'
                fontWeight={800}
              />
            </Bar>
            <Bar
              dataKey='falseNegatives.blur'
              stackId='falseNegatives'
              fill='#4791ff'
              radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey='falseNegatives.blur'
                fill='black'
                fontWeight={800}
              />
            </Bar>
            <Legend align='right' width={150} content={CustomizedLegend} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CustomXAxisTick = ({x, y, payload}) => {
  if (!payload) return null;

  const week = payload.value;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-90}
        y={-14}
        dy={16}
        textAnchor='middle'
        fill='white'
        fontSize={14}
        fontWeight={600}
        fontFamily='Montserrat'>
        Total E.
      </text>
      <text
        x={0}
        y={-14}
        dy={16}
        textAnchor='middle'
        fill='white'
        fontSize={14}
        fontWeight={600}
        fontFamily='Montserrat'>
        False P.
      </text>
      <text
        x={90}
        y={-14}
        dy={16}
        textAnchor='middle'
        fill='white'
        fontSize={14}
        fontWeight={600}
        fontFamily='Montserrat'>
        False N.
      </text>
      <text
        x={0}
        y={14}
        dy={16}
        textAnchor='middle'
        fill='white'
        fontFamily='Montserrat'>
        {week}
      </text>
    </g>
  );
};

const CustomizedLegend = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignContent: 'space-between',
        gap: '20px',
      }}>
      <div className='flex'>
        <svg
          width='14'
          height='14'
          viewBox='0 0 32 32'
          style={{marginRight: '5px', borderRadius: '50%'}}>
          <rect fill={'#4791ff'} width='32' height='32' />
        </svg>
        <span style={{color: '#d7dadb', fontFamily: 'Montserrat'}}>Blobs</span>
      </div>
      <div className='flex'>
        <svg
          width='14'
          height='14'
          viewBox='0 0 32 32'
          style={{marginRight: '5px', borderRadius: '50%'}}>
          <rect fill={'#ffd950'} width='32' height='32' />
        </svg>
        <span style={{color: '#d7dadb', fontFamily: 'Montserrat'}}>Blur</span>
      </div>
    </div>
  );
};
