import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import ChartData from './ChartData';

import EBStake from './modals/EBStake';
import AllowDelegates from '../modals/actions/AllowDelegates';
import { usePriceFeedContract } from '../../hooks/usePriceFeed';

import useUserAccount from '../../hooks/useUserAccount';
import { useCoreApprovals, useCoreContract } from '../../hooks/useCore';
import { useAddress } from '../../hooks/Web3Context';

import Addresses from '../../constants/contracts/Addresses';
import ConnectWallet from './modals/ConnectWallet';

import { formatPrice } from '../../utils';
import { useEBGetBattleResultsContext } from '../../hooks/EternalBattleContext';
import { useMeralImagePaths } from '../../hooks/useMeralImagePaths';
import { useNFTUtils } from '../../hooks/useNFTUtils';
import ReactTooltip from 'react-tooltip';

const Thumbnail = ({ nft }) => {
	const { elements } = useNFTUtils();
	const { meralImagePaths } = useMeralImagePaths(nft.id);

	if (!meralImagePaths) {
		return <div style={{ width: '42px', height: '42px' }} className="bg-white"></div>;
	}
	const bgImg = meralImagePaths.thumbnail;

	return (
		<div style={{ backgroundColor: elements[nft.bgId].color, width: '42px', height: '42px' }} className="relative">
			<img style={{ width: '42px', height: '42px' }} src={bgImg} alt="" />
		</div>
	);
};

const EBHealthBar = ({ data }) => {
	let longWinner = data.winLongMax > 0 ? data.winLongMax : 1;
	let shortWinner = data.winShortMax > 0 ? data.winShortMax : 1;

	// make sure positive
	longWinner *= 10000;
	shortWinner *= 10000;
	let winTotals = longWinner + shortWinner;

	let longWinnerP = parseInt((longWinner / winTotals) * 100);
	let shortWinnerP = parseInt((shortWinner / winTotals) * 100);

	let longs = data.longsChange > 0 ? data.longsChange : 1;
	let shorts = data.shortsChange > 0 ? data.shortsChange : 1;

	// make sure positive
	longs *= 10000;
	shorts *= 10000;
	let totalScores = longs + shorts;

	let longsP = parseInt((longs / totalScores) * 100);
	let shortsP = parseInt((shorts / totalScores) * 100);

	// width = 198 - 14% for slant

	return (
		<>
			<div className="flex items-stretch m-2 shadow ">
				<button data-tip data-for={`ttLongWinner${data.winningLongNFT.id}`}>
					<Thumbnail nft={data.winningLongNFT} />
				</button>
				<ReactTooltip id={`ttLongWinner${data.winningLongNFT.id}`} type="dark" effect="solid">
					<div className="font-sans">
						<p className="mb-4">
							Winning Long Meral:
							<span className="uppercase">{` ${data.winningLongNFT.metadata.coin} #${data.winningLongNFT.id.padStart(4, '0')}`}</span>
						</p>

						<p>
							Total Combined Results: <span>{data.longsChange} </span>
						</p>
						<p>
							Total Combined HP Staked: <span>{data.longPosSize}</span>
						</p>
					</div>
				</ReactTooltip>
				<div className="bg-white flex-grow text-white border-blue-200 border">
					<div className="flex relative">
						<div className="bg-green-200" style={{ width: `${longWinnerP - 6}%`, height: '36px' }}>
							<span className="text-indigo-800 text-xs absolute left-0 font-bold pl-1">{data.winLongMax}</span>
						</div>
						<div className="bg-pink-200 text-green-200">
							<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M0 0H28L0 36V0Z" fill="currentColor" />
							</svg>
						</div>
						<div className="bg-pink-200" style={{ width: `${shortWinnerP - 6}%`, height: '36px' }}>
							<span className="text-indigo-800 text-xs absolute right-0 bottom-0 font-bold pr-1">{data.winShortMax}</span>
						</div>
					</div>
					<div className="flex relative">
						<div className="bg-green-600" style={{ width: `${longsP}%`, height: '5px' }}></div>
						<div className="bg-pink-600" style={{ width: `${shortsP}%`, height: '5px' }}></div>
					</div>
				</div>
				<button data-tip data-for={`ttShortWinner${data.winningShortNFT.id}`}>
					<Thumbnail nft={data.winningShortNFT} />
				</button>

				<ReactTooltip id={`ttShortWinner${data.winningShortNFT.id}`} type="dark" effect="solid">
					<div className="font-sans">
						<p className="mb-4">
							Winning Short Meral:
							<span className="uppercase">{` ${data.winningShortNFT.metadata.coin} #${data.winningShortNFT.id.padStart(4, '0')}`}</span>
						</p>

						<p>
							Total Combined Results: <span>{data.shortsChange} </span>
						</p>
						<p>
							Total Combined HP Staked: <span>{data.shortPosSize}</span>
						</p>
					</div>
				</ReactTooltip>
			</div>
		</>
	);
};

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
	const { contractPriceFeed } = usePriceFeedContract();

	const { account } = useUserAccount();
	const { contractCore } = useCoreContract();

	const getBattleResults = useEBGetBattleResultsContext();

	const address = useAddress();
	const { EBApproved } = useCoreApprovals(contractCore, address, Addresses.EternalBattle);

	const [isCreateStakeOpen, setIsCreateStakeOpen] = useState(false);
	const [isAllowDelegatesOpen, setIsAllowDelegatesOpen] = useState(false);
	const [isConnectWalletOpen, setIsConnectWalletOpen] = useState(false);
	const [isLong, setIsLong] = useState(true);

	const [healthBar, setHealthBar] = useState(undefined);

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
		if (!account) {
			toggleConnectWallet();
		} else if (EBApproved === true) {
			setIsLong(long);
			toggleJoinBattle();
		} else if (account && !account.allowDelegates) {
			toggleAllowDelegates();
		} else if (EBApproved === false) {
			toggleAllowDelegates();
		} else {
			setIsLong(long);
			toggleJoinBattle();
		}
	};

	if (isLoading) return <div className="chart-card bg-white text-black chart-expanded h-500 w-80"></div>;

	const { image, name, market_data: marketData } = data;

	return (
		<>
			<div className="chart-card bg-white text-black chart-expanded w-80">
				<div className="relative pt-4">
					<img className="mx-auto" src={image?.large} alt={`${name} logo`} />

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
					<div className="h-20"></div>
				</div>
				{healthBar && healthBar.winningLongNFT && healthBar.winningShortNFT && <EBHealthBar data={healthBar} />}
			</div>
			{isAllowDelegatesOpen && <AllowDelegates toggle={toggleAllowDelegates} toggleStake={toggleJoinBattle} EBApproved={EBApproved} />}
			{isCreateStakeOpen && <EBStake contractPriceFeed={contractPriceFeed} toggle={toggleJoinBattle} priceFeed={priceFeed} long={isLong} toggleSide={toggleLong} />}
			{isConnectWalletOpen && <ConnectWallet contractPriceFeed={contractPriceFeed} toggle={toggleConnectWallet} priceFeed={priceFeed} long={isLong} toggleSide={toggleLong} />}
		</>
	);
};

export default PairTrackerCard;
