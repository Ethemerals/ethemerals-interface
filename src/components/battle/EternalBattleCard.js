import { useState, useEffect } from 'react';

import { useEternalBattleAccount, useEternalBattleContract } from '../../hooks/useEternalBattle';
import { usePriceFeedContract } from '../../hooks/usePriceFeed';

import StakedNFTCard from './StakedNFTCard';

import PairTrackerCard from './PairTrackerCard';

const EternalBattleCard = ({ priceFeed }) => {
	const { contractPriceFeed } = usePriceFeedContract();
	const { contractBattle } = useEternalBattleContract();

	const { accountEternalBattle } = useEternalBattleAccount();

	const [stakedNFTs, setStakedNFTs] = useState(undefined);
	const [longNFTs, setLongNFTs] = useState(undefined);
	const [shortNFTs, setShortNFTs] = useState(undefined);

	const [counterTradeBonus, setCounterTradeBonus] = useState(undefined);

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

	useEffect(() => {
		if (stakedNFTs) {
			let counterTradeBonus = 1;
			let longs = stakedNFTs.filter((nft) => nft.actions[0].long);
			setLongNFTs(longs);
			let shorts = stakedNFTs.filter((nft) => nft.actions[0].long === false);
			setShortNFTs(shorts);
			if (longs.length > shorts.length) {
				counterTradeBonus = longs.length / shorts.length;
			}
			if (shorts.length > longs.length) {
				counterTradeBonus = shorts.length / longs.length;
			}
			counterTradeBonus = counterTradeBonus > 5 ? 5 : parseInt(counterTradeBonus);
			setCounterTradeBonus(counterTradeBonus);
		}
	}, [stakedNFTs]);

	if (!accountEternalBattle || !priceFeed || !stakedNFTs) {
		return null;
	}

	return (
		<>
			<div className="flex justify-center items-stretch mt-24">
				<div className="flex-none bg-white">
					<PairTrackerCard priceFeed={priceFeed} cryptoName={priceFeed.baseName.toLowerCase()} />
				</div>
				<div className="w-72 border-white border border-r-0">
					<h3 className="mx-1 text-black text-xs mb-2">
						LONGS ({longNFTs && longNFTs.length > 0 && longNFTs.length})
						<span>{longNFTs && shortNFTs && counterTradeBonus > 1 && longNFTs.length < shortNFTs.length && ` Bonus ELF Mult x${counterTradeBonus}`}</span>
					</h3>
					{longNFTs &&
						longNFTs.length > 0 &&
						longNFTs.map((nft, index) => <StakedNFTCard key={index} nft={nft} contractBattle={contractBattle} contractPriceFeed={contractPriceFeed} priceFeed={priceFeed} />)}
				</div>

				<div className="w-72 border-white border border-l-0">
					<h3 className="mx-1 text-black text-xs mb-2">
						SHORTS ({shortNFTs && shortNFTs.length > 0 && shortNFTs.length})
						<span className="text-brandColor">{longNFTs && shortNFTs && counterTradeBonus > 1 && longNFTs.length > shortNFTs.length && ` - Bonus ELF Mult x${counterTradeBonus}`}</span>
					</h3>

					{shortNFTs &&
						shortNFTs.length > 0 &&
						shortNFTs.map((nft, index) => <StakedNFTCard key={index} nft={nft} contractBattle={contractBattle} contractPriceFeed={contractPriceFeed} priceFeed={priceFeed} />)}
				</div>
			</div>
		</>
	);
};

export default EternalBattleCard;
