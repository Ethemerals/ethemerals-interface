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

	return <span className={`${isPositive ? 'text-green-600' : 'text-red-600'}`}>{`${isPositive ? '+' : ''}${priceChange.toFixed(2)}%`}</span>;
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

	if (isLoading) return <div className="chart-card bg-white text-black chart-expanded h-500 w-80"></div>;

	const { name, market_data: marketData } = data;

	return (
		<>
			<div className="chart-card bg-white text-black chart-expanded w-80">
				<div className="pt-4">
					<img className="mx-auto" src={priceFeed.logo} alt={`${name} logo`} />

					<h3 className="text-xl ">{priceFeed.ticker}</h3>
					<p className="mb-4 text-gray-500">{`${priceFeed.baseName} vs ${priceFeed.quoteName}`}</p>

					<div className="flex items-start justify-center space-x-3">
						<button onClick={() => handleJoinBattle(true)} className=" bg-gray-600 px-2 shadow text-white py-1 hover:bg-green-600 hover:shadow-lg transition duration-300">
							JOIN {priceFeed.baseSymbol}
						</button>
						<button onClick={() => handleJoinBattle(false)} className=" bg-gray-600 px-2 shadow text-white py-1 hover:bg-red-600 hover:shadow-lg transition duration-300">
							JOIN {priceFeed.quoteSymbol}
						</button>
					</div>

					<h4 className="chart-crypto-price mt-4 mb-8">
						{formatPrice(marketData?.current_price?.usd)}
						{formatPlusMinus(marketData?.price_change_percentage_24h)}
					</h4>

					<ChartData isExpanded={true} cryptoName={cryptoName} />
				</div>
				{healthBar && healthBar.winningLongNFT && healthBar.winningShortNFT && <EBHealthBar key={priceFeed.ticker} data={healthBar} />}
			</div>
			{/* {isAllowDelegatesOpen && <AllowDelegates toggle={toggleAllowDelegates} toggleStake={toggleJoinBattleLong} />} */}
			{/* {isCreateStakeLongOpen && <EBStake key={`${priceFeed.ticker}long`} contractPriceFeed={contractPriceFeed} toggle={toggleJoinBattleLong} priceFeed={priceFeed} long={true} />} */}
			{/* {isCreateStakeShortOpen && <EBStake key={`${priceFeed.ticker}short`} contractPriceFeed={contractPriceFeed} toggle={toggleJoinBattleShort} priceFeed={priceFeed} long={false} />} */}
			{/* {isConnectWalletOpen && <ConnectWallet contractPriceFeed={contractPriceFeed} toggle={toggleConnectWallet} />} */}
		</>
	);
};

export default PairTrackerCard;
