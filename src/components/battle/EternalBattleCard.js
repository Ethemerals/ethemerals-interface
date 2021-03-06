import { useState, useEffect } from 'react';

import { useEternalBattleL1Account, useEternalBattleL1Contract } from '../../hooks/useEternalBattleL1';
import StakedNFTCard from './StakedNFTCard';

import PairTrackerCard from './PairTrackerCard';

const EternalBattleCard = ({ priceFeed }) => {
	const { contractBattle } = useEternalBattleL1Contract();
	const { accountEternalBattle } = useEternalBattleL1Account();

	const [stakedNFTs, setStakedNFTs] = useState(undefined);
	const [longNFTs, setLongNFTs] = useState(undefined);
	const [shortNFTs, setShortNFTs] = useState(undefined);

	const [counterTradeBonus, setCounterTradeBonus] = useState(undefined);

	useEffect(() => {
		const staked = [];
		if (accountEternalBattle) {
			if (accountEternalBattle.merals.length > 0) {
				accountEternalBattle.merals.forEach((nft) => {
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
			if (shorts.length > 0 && longs.length > shorts.length) {
				counterTradeBonus = longs.length / shorts.length;
			}
			if (longs.length > 0 && shorts.length > longs.length) {
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
			<div className="flex justify-center items-stretch mt-8">
				<div className="w-72 border-white border border-r-0">
					<h3 className="px-1 text-black text-xs mb-2 w-full bg-green-200 font-bold">
						LONGS ({longNFTs && longNFTs.length > 0 && longNFTs.length})
						<span className="text-brandColor-purple">{longNFTs && shortNFTs && counterTradeBonus > 1 && longNFTs.length < shortNFTs.length && ` - Bonus ELF Multiplier x${counterTradeBonus}`}</span>
					</h3>
					{longNFTs && longNFTs.length > 0 && longNFTs.map((nft) => <StakedNFTCard key={nft.id} nft={nft} contractBattle={contractBattle} priceFeed={priceFeed} long={true} />)}
				</div>
				<div className="bg-white">
					<PairTrackerCard priceFeed={priceFeed} cryptoName={priceFeed.baseName.toLowerCase()} />
				</div>

				<div className="w-72 border-white border border-l-0">
					<h3 className="px-1 text-black text-xs mb-2 bg-pink-200 font-bold">
						SHORTS ({shortNFTs && shortNFTs.length > 0 && shortNFTs.length})
						<span className="text-brandColor-purple">{longNFTs && shortNFTs && counterTradeBonus > 1 && longNFTs.length > shortNFTs.length && ` - Bonus ELF Multiplier x${counterTradeBonus}`}</span>
					</h3>

					{shortNFTs && shortNFTs.length > 0 && shortNFTs.map((nft) => <StakedNFTCard key={nft.id} nft={nft} contractBattle={contractBattle} priceFeed={priceFeed} long={false} />)}
				</div>
			</div>
		</>
	);
};

export default EternalBattleCard;
