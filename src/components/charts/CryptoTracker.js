import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import ChartData from './ChartData';

import EternalBattleStake from '../modals/actions/EternalBattleStake';
import AllowDelegates from '../modals/actions/AllowDelegates';
import { useEternalBattleAccount } from '../../hooks/useEternalBattle';
import { usePriceFeedContract } from '../../hooks/usePriceFeed';

import useUserAccount from '../../hooks/useUserAccount';
import { useCoreApprovals, useCoreContract } from '../../hooks/useCore';
import { useAddress } from '../../hooks/Web3Context';

import Addresses from '../../constants/contracts/Addresses';

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

export const formatPrice = (price) => {
	const formatConfig = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	});

	return formatConfig.format(price);
};

const formatPlusMinus = (priceChange) => {
	const isPositive = Math.sign(priceChange) >= 0;

	return <span className={`${isPositive ? 'text-green-600' : 'text-red-600'}`}>{`${isPositive ? '+' : ''}${priceChange.toFixed(2)}%`}</span>;
};

const CryptoTracker = ({ priceFeed }) => {
	const cryptoName = priceFeed.baseName.toLowerCase();
	const { contractPriceFeed } = usePriceFeedContract();

	const { account } = useUserAccount();
	const { contractCore } = useCoreContract();

	const address = useAddress();
	const { EBApproved } = useCoreApprovals(contractCore, address, Addresses.EternalBattle);

	const [isCreateStakeOpen, setIsCreateStakeOpen] = useState(false);
	const [isAllowDelegatesOpen, setIsAllowDelegatesOpen] = useState(false);

	const [isLong, setIsLong] = useState(true);

	const { data, isLoading } = useGetCardData(cryptoName, {
		refetchInterval: 60000,
		staleTime: 60000,
	});

	const toggleLong = () => {
		setIsLong(!isLong);
	};

	const toggleJoinBattle = () => {
		setIsCreateStakeOpen(!isCreateStakeOpen);
	};

	const toggleAllowDelegates = () => {
		setIsAllowDelegatesOpen(!isAllowDelegatesOpen);
	};

	const handleJoinBattle = (long) => {
		if (EBApproved === true) {
			toggleJoinBattle();
			setIsLong(long);
		} else if (account && !account.allowDelegates) {
			toggleAllowDelegates();
		} else if (EBApproved === false) {
			toggleAllowDelegates();
		} else {
			toggleJoinBattle();
			setIsLong(long);
		}
	};

	if (isLoading) return null;

	const { image, name, market_data: marketData } = data;

	return (
		<>
			<div className="chart-card bg-white text-black chart-expanded h-500 w-80">
				<div className="relative pt-4">
					<img className="mx-auto" src={image?.large} alt={`${name} logo`} />

					<h3 className="text-xl ">{priceFeed.ticker}</h3>
					<p className="mb-4">{name}</p>

					<button onClick={() => handleJoinBattle(true)} className=" bg-blue-500 px-4 text-xl shadow rounded text-white py-1 hover:bg-blue-400 transition duration-300">
						JOIN THE BATTLE!
					</button>

					<h4 className="chart-crypto-price mt-4 mb-8">
						{formatPrice(marketData?.current_price?.usd)}
						{formatPlusMinus(marketData?.price_change_percentage_24h)}
					</h4>

					<ChartData isExpanded={true} cryptoName={cryptoName} />
				</div>
			</div>
			{isAllowDelegatesOpen && <AllowDelegates toggle={toggleAllowDelegates} toggleStake={toggleJoinBattle} EBApproved={EBApproved} />}
			{isCreateStakeOpen && <EternalBattleStake contractPriceFeed={contractPriceFeed} toggle={toggleJoinBattle} priceFeed={priceFeed} long={isLong} toggleSide={toggleLong} />}
		</>
	);
};

export default CryptoTracker;
