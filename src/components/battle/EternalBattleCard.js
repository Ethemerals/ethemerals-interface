import { useState, useEffect } from 'react';

import { useEternalBattleAccount } from '../../hooks/useEternalBattle';
import { usePriceFeedContract } from '../../hooks/usePriceFeed';

import StakedNFT from './StakedNFT';

import CryptoTracker from '../charts/CryptoTracker';

const EternalBattleCard = ({ priceFeed }) => {
	const { contractPriceFeed } = usePriceFeedContract();

	const { accountEternalBattle } = useEternalBattleAccount();

	const [stakedNFTs, setStakedNFTs] = useState([]);

	useEffect(() => {
		const staked = [];
		if (accountEternalBattle) {
			if (accountEternalBattle.ethemerals.length > 0) {
				accountEternalBattle.ethemerals.forEach((nft) => {
					if (nft.actions[0].priceFeed === priceFeed.id.toString()) {
						staked.push(nft);
					}
				});
			}
		}
		setStakedNFTs(staked);
	}, [accountEternalBattle, priceFeed.id]);

	return (
		<>
			<div className="flex justify-center items-stretch mt-24">
				<div className="flex-none bg-white">
					<CryptoTracker priceFeed={priceFeed} cryptoName={priceFeed.baseName.toLowerCase()} />
				</div>
				<div className="bg-blue-500 w-72 pt-16">
					<h3>Current Long Merals</h3>
					{stakedNFTs.map((nft, index) => nft.actions[0].long && <StakedNFT key={index} nft={nft} contractPriceFeed={contractPriceFeed} priceFeed={priceFeed} />)}
				</div>

				<div className="bg-blue-500 w-72 pt-16">
					<h3>Current Short Merals</h3>

					{stakedNFTs.map((nft, index) => !nft.actions[0].long && <StakedNFT key={index} nft={nft} contractPriceFeed={contractPriceFeed} priceFeed={priceFeed} />)}
				</div>
			</div>
		</>
	);
};

export default EternalBattleCard;
