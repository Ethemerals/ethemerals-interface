import { useState, useEffect } from 'react';

import EternalBattleStake from '../modals/actions/EternalBattleStake';
import DisallowDelegates from '../modals/actions/DisallowDelegates';
import { useEternalBattleAccount } from '../../hooks/useEternalBattle';
import { usePriceFeedPrice } from '../../hooks/usePriceFeed';

import StakedNFT from './StakedNFT';
import useUserAccount from '../../hooks/useUserAccount';

const EternalBattleCard = ({ contractPriceFeed, priceFeed }) => {
	const { price } = usePriceFeedPrice(contractPriceFeed, priceFeed);
	const { accountEternalBattle } = useEternalBattleAccount();
	const { account } = useUserAccount();

	const [baseName, setBaseName] = useState('');
	const [quoteName, setQuoteName] = useState('');
	const [ticker, setTicker] = useState('');
	const [stakedNFTs, setStakedNFTs] = useState([]);
	const [isLong, setIsLong] = useState(true);
	const [isCreateStakeOpen, setIsCreateStakeOpen] = useState(false);
	const [isDisallowDelegatesOpen, setIsDisallowDelegatesOpen] = useState(false);

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
		setBaseName(priceFeed.baseName);
		setQuoteName(priceFeed.quoteName);
		setTicker(priceFeed.name);
	}, [priceFeed]);

	const toggleJoinBattle = () => {
		setIsCreateStakeOpen(!isCreateStakeOpen);
	};

	const toggleDisallowDelegates = () => {
		setIsDisallowDelegatesOpen(!isDisallowDelegatesOpen);
	};

	const handleJoinBattle = (long) => {
		if (account && account.disallowDelegates) {
			toggleDisallowDelegates();
		} else {
			toggleJoinBattle();
			setIsLong(long);
		}
	};

	return (
		<>
			<div className="flex justify-center">
				<div className="bg-gray-700 p-4 m-4 w-full max-w-4xl">
					<h3>
						{baseName} vs {quoteName}
					</h3>
					<p>{ticker}</p>
					<p>Price: {price}</p>
					<hr></hr>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<button onClick={() => handleJoinBattle(true)} className="p-2 my-2 rounded bg-brandColor-purple">
								Join {baseName}
							</button>
							<h3>Current Fighters</h3>
							{stakedNFTs.map((nft, index) => nft.actions[0].long && <StakedNFT key={index} nft={nft} contractPriceFeed={contractPriceFeed} priceFeed={priceFeed} />)}
						</div>
						<div>
							<button onClick={() => handleJoinBattle(false)} className="p-2 my-2 rounded bg-brandColor-purple">
								Join {quoteName}
							</button>
							<h3>Current Fighters</h3>
							{stakedNFTs.map((nft, index) => !nft.actions[0].long && <StakedNFT key={index} nft={nft} contractPriceFeed={contractPriceFeed} priceFeed={priceFeed} />)}
						</div>
					</div>
				</div>
			</div>
			{isDisallowDelegatesOpen && <DisallowDelegates toggle={toggleDisallowDelegates} />}
			{isCreateStakeOpen && <EternalBattleStake contractPriceFeed={contractPriceFeed} toggle={toggleJoinBattle} priceFeed={priceFeed} long={isLong} />}
		</>
	);
};

export default EternalBattleCard;
