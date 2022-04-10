import { useQuery } from 'react-query';
import NiceModal from '@ebay/nice-modal-react';
import { useState, useEffect } from 'react';
import ChartData from './ChartData';

import { formatPrice } from '../../../utils';

import SVGChainLink from '../svg/SVGChainLink';
import SVGCoinGecko from '../svg/SVGCoinGecko';
import Champions from './Champions';
import { modalRegistry } from '../../niceModals/RegisterModals';

const useGetCardData = (cryptoName, options) => {
	return useQuery(
		`${cryptoName}-card`,
		async () => {
			const response = await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoName}`);
			return await response.json();
		},
		options
	);
};

const formatPlusMinus = (priceChange) => {
	const isPositive = Math.sign(priceChange) >= 0;

	return (
		<span style={{ fontSize: '12px', fontWeight: '400', top: '-12px', left: '6px' }} className={`${isPositive ? 'text-green-600' : 'text-red-600'} relative`}>{`${
			isPositive ? '+' : ''
		}${priceChange.toFixed(2)}%`}</span>
	);
};

const PriceTracker = ({ priceFeed }) => {
	const cryptoName = priceFeed.baseName.toLowerCase();
	const [marketData, setMarketData] = useState(undefined);

	const { data, isLoading } = useGetCardData(cryptoName, {
		refetchInterval: 60000,
		staleTime: 60000,
	});

	useEffect(() => {
		if (data && !isLoading) {
			const { market_data } = data;
			setMarketData(market_data);
		}
		return () => {
			setMarketData(undefined);
		};
	}, [data, isLoading]);

	const onSubmitChoose = async (long) => {
		NiceModal.show(modalRegistry.ebMarkets);
	};

	const styleBoxshadow = {
		boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.4)',
	};

	return (
		<>
			<div className="text-black w-full">
				<div className="mt-2 p-4 pb-2 text-white flex items-center">
					<h2 className="text-4xl">{priceFeed.ticker}</h2>
					<div
						onClick={onSubmitChoose}
						style={{ transform: 'translate(0px, 4px)', paddingTop: '3px', paddingBottom: '3px' }}
						className="ml-3 bg-gray-800 px-4 text-xs font-bold flex items-center shadow cursor-pointer relative rounded-md border-gray-400 border bg-opacity-40 text-pink-200 hover:text-white transition 300"
					>
						<span>CHANGE MARKETS</span>
						<div style={{ top: '-4px', right: '-3px' }} className="animate-ping bg-white rounded-full w-2 h-2 absolute"></div>
						<div style={{ top: '-4px', right: '-3px' }} className="bg-pink-200 rounded-full w-2 h-2 absolute"></div>
					</div>
				</div>
				<div className="flex items-stretch space-x-4">
					<div style={styleBoxshadow} className="bg-white w-2/3 p-4 flex rounded-md">
						<div className="w-1/2 relative">
							<div className="flex items-center space-x-2 overflow-hidden">
								<img style={{ width: '24px', height: '24px' }} src={priceFeed.logo} alt={``} />
								<span>{`${priceFeed.baseName} vs ${priceFeed.quoteName}`}</span>
							</div>

							{marketData && (
								<>
									<p className="font-light text-2xl mt-2 mb-4">
										{formatPrice(marketData?.current_price?.usd, priceFeed.priceDecimalPlaces)}
										{formatPlusMinus(marketData?.price_change_percentage_24h)}
									</p>
									<div style={{ borderBottom: '1px solid white' }} className="text-xs flex items-center justify-between pb-2 mb-3 text-gray-600">
										<span>MARKET RANK:</span>
										<span>{marketData.coingecko_rank}</span>
									</div>
									<div style={{ borderBottom: '1px solid white' }} className="text-xs flex items-center justify-between pb-2 mb-3 text-gray-600">
										<span>MARKET CAP:</span>
										<span>{formatPrice(marketData?.market_cap?.usd, priceFeed.volDecimalPlaces)}</span>
									</div>
									<div style={{ borderBottom: '1px solid white' }} className="text-xs flex items-center justify-between pb-2 mb-3 text-gray-600">
										<span>VOLUME:</span>
										<span>{formatPrice(marketData?.total_volume?.usd, priceFeed.volDecimalPlaces)}</span>
									</div>
								</>
							)}

							<div className="flex w-full items-center justify-between absolute bottom-0 mb-2">
								<a href={priceFeed.chainlink} target="blank" rel="noreferrer" className="flex items-center">
									<SVGChainLink />
									<span className="text-xs text-gray-400 pl-1">Chainlink Price Feed</span>
								</a>
								<a href={priceFeed.coingecko} target="blank" rel="noreferrer" className="flex items-center">
									<SVGCoinGecko />
									<span className="text-xs text-gray-400 pl-1">Coingecko</span>
								</a>
							</div>
						</div>
						<div>
							<ChartData isExpanded={true} cryptoName={cryptoName} />
						</div>
					</div>
					<Champions priceFeed={priceFeed} />
				</div>
			</div>
		</>
	);
};

export default PriceTracker;
