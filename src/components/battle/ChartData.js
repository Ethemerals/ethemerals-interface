import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTooltip, VictoryVoronoiContainer } from 'victory';
import format from 'date-fns/format';
import { formatPrice } from '../../utils';

const intervals = [
	{
		label: '24h',
		value: 1,
	},
	{
		label: '7D',
		value: 7,
	},
	{
		label: '1M',
		value: 30,
	},
	{
		label: '3M',
		value: 90,
	},
];

const useGetChartData = (cryptoName, interval, options) => {
	return useQuery(
		[`${cryptoName}-chartData`, interval],
		async () => {
			const response = await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoName}/market_chart?vs_currency=usd&days=${interval}`);
			return await response.json();
		},
		options
	);
};

const ChartData = ({ cryptoName }) => {
	const [dataInterval, setDataInterval] = useState(intervals[0].value);

	const { isLoading, data } = useGetChartData(cryptoName, dataInterval, {
		refetchInterval: 60000,
		staleTime: 60000,
		select: (data) =>
			data?.prices?.map((item) => ({
				x: item[0],
				y: item[1],
			})),
	});

	return (
		<div className="chart h-44">
			<div className="m-0">
				{intervals.map((interval) => (
					<button key={interval.value} className={`${dataInterval === interval.value ? 'text-blue-500' : 'text-gray-400 hover:text-blue-400'} px-2`} onClick={() => setDataInterval(interval.value)}>
						{interval.label}
					</button>
				))}
			</div>
			{isLoading ? (
				<div className="chart-loading-container">
					<span>Loading...</span>
				</div>
			) : (
				<VictoryChart
					width={500}
					height={300}
					domainPadding={0}
					containerComponent={
						<VictoryVoronoiContainer
							labels={({ datum }) => formatPrice(datum.y)} // Format the price
							title={`${cryptoName} price data chart`} // For screen readers
							labelComponent={
								<VictoryTooltip
									style={{
										fill: 'white',
										fontSize: 12,
									}}
									flyoutStyle={{
										fill: 'black',
										stroke: 'black',
										strokeWidth: 2,
										margin: 10,
									}}
								/>
							}
						/>
					}
				>
					<VictoryLine style={{ data: { stroke: '#3f79dc', strokeWidth: 2 } }} data={data} />
					<VictoryAxis
						orientation="bottom"
						style={{
							axis: { stroke: 'black', strokeWidth: 1 },
							tickLabels: {
								fill: 'black',
								fontSize: 16,
							},
						}}
						tickFormat={(x) => {
							if (dataInterval === 1) {
								return format(x, 'p');
							}

							return format(x, 'MM/dd');
						}}
					/>
				</VictoryChart>
			)}
		</div>
	);
};

export default ChartData;
