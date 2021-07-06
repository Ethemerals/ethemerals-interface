import { useEffect, useState } from 'react';
import { usePriceFeedContract } from '../hooks/usePriceFeed';

import PriceFeeds from '../constants/PriceFeeds';

import EternalBattleCard from '../components/battle/EternalBattleCard';
import { useCore } from '../hooks/useCore';
import { formatELF } from '../utils';
import useUserAccount from '../hooks/useUserAccount';

import WinnerFund from '../components/modals/actions/WinnerFund';

const Battle = () => {
	const { contractPriceFeed } = usePriceFeedContract();
	const { core } = useCore();
	const { account } = useUserAccount();
	const [winningCoin, setWinningCoin] = useState(false);
	const [isOwnedWinning, setIsOwnedWinning] = useState(false);
	const [isWinnerFundOpen, setIsWinnerFundOpen] = useState(false);

	// TODO do without provider

	useEffect(() => {
		if (account && core) {
			if (account.ethemerals.length > 0) {
				setIsOwnedWinning(false);
				account.ethemerals.forEach((userNFT) => {
					if (userNFT.id === core.winningCoin) {
						setIsOwnedWinning(true);
						setWinningCoin(userNFT);
					}
				});
			}
		}
	}, [account, core, winningCoin]);

	const toggleWinnerFund = () => {
		setIsWinnerFundOpen(!isWinnerFundOpen);
	};

	return (
		<>
			<h1>Battle</h1>
			<h2>Eternal Battle</h2>

			{core && (
				<div className="w-full flex bg-gray-600 max-w-4xl mx-auto space-x-3 items-center">
					<p>{`Highest Honor Funds: ${formatELF(core.winnerFunds)} ELF`}</p>
					<p>{`Rewards Multiplier: ${core.winnerMult}`}</p>
					<div className="flex items-center">
						<p>{`Winning Ethemeral: ${core.winningCoin}`}</p>

						<button
							onClick={toggleWinnerFund}
							disabled={!isOwnedWinning}
							className={`${isOwnedWinning ? 'bg-pink-700 cursor-pointer' : 'bg-gray-500 cursor-default'} px-4 py-2 rounded-xl text-xs mx-2`}
						>
							Claim
						</button>
					</div>
				</div>
			)}

			<EternalBattleCard contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[0]} />
			<EternalBattleCard contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[1]} />
			<EternalBattleCard contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[2]} />
			<EternalBattleCard contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[3]} />
			{core && winningCoin && isWinnerFundOpen && <WinnerFund nft={winningCoin} toggle={toggleWinnerFund} />}
		</>
	);
};

export default Battle;
