import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import ChartData from './ChartData';

import EBStake from '../modals/EBStake';
import AllowDelegates from '../../ethemerals/modals/AllowDelegates';
import { usePriceFeedContract } from '../../../hooks/usePriceFeed';

import { useUser, useUserAccount } from '../../../hooks/useUser';

import ConnectWallet from '../modals/ConnectWallet';

import { formatPrice } from '../../../utils';
import { useEBGetBattleResultsContext } from '../../../context/EternalBattleContext';

import EBHealthBar from './EBHealthBar';
import { Addresses } from '../../../constants/contracts/Addresses';
import { useCoreApprovals } from '../../../hooks/useCore';
import SVGChainLink from '../svg/SVGChainLink';
import SVGCoinGecko from '../svg/SVGCoinGecko';

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

const PairTrackerCard = ({ priceFeed }) => {
	const cryptoName = priceFeed.baseName.toLowerCase();

	const { isUnauthenticated } = useUser();
	const { contractPriceFeed } = usePriceFeedContract();
	const { account, address } = useUserAccount();
	const { isApprovedForAll } = useCoreApprovals(address, Addresses.EternalBattle.toLowerCase());

	const getBattleResults = useEBGetBattleResultsContext();

	const [isCreateStakeLongOpen, setIsCreateStakeLongOpen] = useState(false);
	const [isCreateStakeShortOpen, setIsCreateStakeShortOpen] = useState(false);
	const [isAllowDelegatesOpen, setIsAllowDelegatesOpen] = useState(false);
	const [isConnectWalletOpen, setIsConnectWalletOpen] = useState(false);

	const [healthBar, setHealthBar] = useState(undefined);

	const { data, isLoading } = useGetCardData(cryptoName, {
		refetchInterval: 60000,
		staleTime: 60000,
	});

	useEffect(() => {
		if (!isUnauthenticated) {
			setIsConnectWalletOpen(false);
		}
	}, [isUnauthenticated]);

	useEffect(() => {
		if (isApprovedForAll) {
			setIsAllowDelegatesOpen(false);
		}
	}, [isApprovedForAll]);

	const toggleJoinBattleLong = () => {
		setIsCreateStakeLongOpen(!isCreateStakeLongOpen);
	};

	const toggleJoinBattleShort = () => {
		setIsCreateStakeShortOpen(!isCreateStakeShortOpen);
	};

	const toggleAllowDelegates = () => {
		setIsAllowDelegatesOpen(!isAllowDelegatesOpen);
	};

	const toggleConnectWallet = () => {
		setIsConnectWalletOpen(!isConnectWalletOpen);
	};

	useEffect(() => {
		const timer = setInterval(() => {
			getBattleResults(priceFeed.id).then((data) => {
				setHealthBar(data);
			});
		}, 20000);
		return () => clearTimeout(timer);
	}, [getBattleResults, priceFeed]);

	useEffect(() => {
		const timer = setTimeout(() => {
			getBattleResults(priceFeed.id).then((data) => {
				setHealthBar(data);
			});
		}, 2000);
		return () => clearTimeout(timer);
	}, [getBattleResults, priceFeed]);

	const handleJoinBattle = (long) => {
		if (!address) {
			toggleConnectWallet();
		} else if (isApprovedForAll === true) {
			if (long) {
				toggleJoinBattleLong();
			} else {
				toggleJoinBattleShort();
			}
		} else if (account && !account.allowDelegates) {
			toggleAllowDelegates();
		} else if (account && isApprovedForAll === false) {
			toggleAllowDelegates();
		} else {
			if (long) {
				toggleJoinBattleLong();
			} else {
				toggleJoinBattleShort();
			}
		}
	};

	if (isLoading) return <div></div>;

	const { market_data: marketData } = data;

	return (
		<>
			<div className="text-black w-full">
				<div className="my-2 p-4 text-white">
					<p className="text-4xl">{priceFeed.ticker}</p>
				</div>
				<div className="flex items-stretch space-x-4">
					<div className="bg-white w-2/3 p-4 flex rounded-md bg-opacity-90">
						<div className="w-1/2">
							<div className="flex items-center space-x-2 overflow-hidden">
								<img style={{ width: '24px', height: '24px' }} src={priceFeed.logo} alt={``} />
								<span>{`${priceFeed.baseName} vs ${priceFeed.quoteName}`}</span>
							</div>

							<p className="font-light text-2xl mt-2 mb-4">
								{formatPrice(marketData?.current_price?.usd, priceFeed.priceDecimalPlaces)}
								{formatPlusMinus(marketData?.price_change_percentage_24h)}
							</p>
							<div style={{ borderBottom: '1px solid white' }} className="text-xs flex items-center justify-between pb-2 mb-3 text-gray-600">
								<span>MARKET RANK:</span>
								<span>{data.coingecko_rank}</span>
							</div>
							<div style={{ borderBottom: '1px solid white' }} className="text-xs flex items-center justify-between pb-2 mb-3 text-gray-600">
								<span>MARKET CAP:</span>
								<span>{formatPrice(marketData?.market_cap?.usd, priceFeed.volDecimalPlaces)}</span>
							</div>
							<div style={{ borderBottom: '1px solid white' }} className="text-xs flex items-center justify-between pb-2 mb-3 text-gray-600">
								<span>VOLUME:</span>
								<span>{formatPrice(marketData?.total_volume?.usd, priceFeed.volDecimalPlaces)}</span>
							</div>

							<div className="flex items-center mt-11 justify-between">
								<a href={priceFeed.chainlink} target="blank" rel="noreferrer" className="flex items-center">
									<SVGChainLink />
									<span className="text-xs text-gray-400 pl-1">Chainlink Data Feed</span>
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

					<div className="bg-white w-1/3 p-4 rounded-md bg-opacity-90">
						<p className="">Current Champion:</p>
						{/* <p className="text-gray-500">{`${priceFeed.baseName} vs ${priceFeed.quoteName}`}</p>
						<p className="font-light text-2xl mt-2 mb-4">
							{formatPrice(marketData?.current_price?.usd)}
							{formatPlusMinus(marketData?.price_change_percentage_24h)}
						</p> */}
						<p className="">Last Season Champion:</p>
						<p className="">Next Season beings in 21 Days</p>
					</div>
				</div>

				{/* <div className="flex items-start justify-center space-x-3">
					<button onClick={() => handleJoinBattle(true)} className=" bg-gray-600 px-2 shadow text-white py-1 hover:bg-green-600 hover:shadow-lg transition duration-300">
						JOIN {priceFeed.baseSymbol}
					</button>
					<button onClick={() => handleJoinBattle(false)} className=" bg-gray-600 px-2 shadow text-white py-1 hover:bg-red-600 hover:shadow-lg transition duration-300">
						JOIN {priceFeed.quoteSymbol}
					</button>
				</div> */}
			</div>
			{/* {healthBar && healthBar.winningLongNFT && healthBar.winningShortNFT && <EBHealthBar key={priceFeed.ticker} data={healthBar} />} */}
		</>
	);
};

export default PairTrackerCard;
