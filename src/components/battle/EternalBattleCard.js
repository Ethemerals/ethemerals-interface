import { useState, useEffect } from 'react';

import { useEternalBattleAccount, useEternalBattleContract } from '../../hooks/useEternalBattle';
import { usePriceFeedContract } from '../../hooks/usePriceFeed';

import StakedNFTCard from './StakedNFTCard';

import CryptoTracker from '../charts/CryptoTracker';

const EternalBattleCard = ({ priceFeed }) => {
	const { contractPriceFeed } = usePriceFeedContract();
	const { contractBattle } = useEternalBattleContract();

	const { accountEternalBattle } = useEternalBattleAccount();

	const [stakedNFTs, setStakedNFTs] = useState(undefined);

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

	if (!accountEternalBattle || !priceFeed || !stakedNFTs) {
		return null;
	}

	return (
		<>
			<div className="flex justify-center items-stretch mt-24">
				<div className="flex-none bg-white">
					<CryptoTracker priceFeed={priceFeed} cryptoName={priceFeed.baseName.toLowerCase()} />
				</div>
				<div className="w-72 pt-16 border-white border border-r-0">
					<h3 className="mx-1 text-black text-xs mb-2">CURRENT LONGS</h3>
					{stakedNFTs.map((nft, index) => nft.actions[0].long && <StakedNFTCard key={index} nft={nft} contractBattle={contractBattle} contractPriceFeed={contractPriceFeed} priceFeed={priceFeed} />)}
				</div>

				<div className="w-72 pt-16 border-white border border-l-0">
					<h3 className="mx-1 text-black text-xs mb-2">CURRENT SHORTS</h3>

					{stakedNFTs.map((nft, index) => !nft.actions[0].long && <StakedNFTCard key={index} nft={nft} contractBattle={contractBattle} contractPriceFeed={contractPriceFeed} priceFeed={priceFeed} />)}
				</div>
			</div>
		</>
	);
};

export default EternalBattleCard;
