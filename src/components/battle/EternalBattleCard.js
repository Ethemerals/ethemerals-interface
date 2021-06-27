import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import StakeEternalBattle from '../modals/actions/StakeEternalBattle';
import useEternalBattleAccount from '../../hooks/useEternalBattleAccount';
import useUserAccount from '../../hooks/useUserAccount';

import StakedNFT from './StakedNFT';

const getPrice = async (contract, index) => {
	try {
		const price = await contract.getPrice(index);
		return price.toString();
	} catch (error) {
		throw new Error('error');
	}
};

const EternalBattleCard = ({ contractPriceFeed, priceFeed }) => {
	const { isLoading, isError, data } = useQuery([`priceFeed${priceFeed.id}`, priceFeed.id], () => getPrice(contractPriceFeed, priceFeed.id));
	const { accountEternalBattle } = useEternalBattleAccount(); // TODO INVALIDATE

	const [baseName, setBaseName] = useState('');
	const [quoteName, setQuoteName] = useState('');
	const [ticker, setTicker] = useState('');
	const [price, setPrice] = useState(undefined);
	const [stakedNFTs, setStakedNFTs] = useState([]);
	const [isLong, setIsLong] = useState(true);
	const [isCreateStakeOpen, setIsCreateStakeOpen] = useState(false);

	useEffect(() => {
		if (accountEternalBattle) {
			if (accountEternalBattle.ethemerals.length > 0) {
				const staked = [];
				accountEternalBattle.ethemerals.forEach((nft) => {
					if (nft.actions[0].priceFeed === priceFeed.id.toString()) {
						staked.push(nft);
					}
				});
				setStakedNFTs(staked);
			}
		}
	}, [accountEternalBattle]);

	useEffect(() => {
		console.log(stakedNFTs);
	}, [stakedNFTs]);

	useEffect(() => {
		if (priceFeed) {
			setBaseName(priceFeed.baseName);
			setQuoteName(priceFeed.quoteName);
			setTicker(priceFeed.name);
		}
	}, [priceFeed]);

	useEffect(() => {
		if (!isLoading) {
			setPrice(data);
		}
	}, [data, isLoading]);

	const toggleJoinBattle = () => {
		setIsCreateStakeOpen(!isCreateStakeOpen);
	};

	const handleJoinBattle = (long) => {
		toggleJoinBattle();
		setIsLong(long);
	};

	return (
		<>
			<div>
				<div className="w-420 bg-gray-700 p-4 m-4">
					<h3>
						{baseName} vs {quoteName}
					</h3>
					<button onClick={() => handleJoinBattle(true)} className="p-2 m-2 rounded bg-brandColor-purple">
						Join {baseName}
					</button>
					<button onClick={() => handleJoinBattle(false)} className="p-2 m-2 rounded bg-brandColor-purple">
						Join {quoteName}
					</button>
					<p>{ticker}</p>
					<p>Price: {price}</p>

					<h3>Current Fighters</h3>
					{stakedNFTs.map((nft, index) => (
						<StakedNFT key={index} nft={nft} contractPriceFeed={contractPriceFeed} priceFeed={priceFeed} />
					))}
				</div>
			</div>
			{isCreateStakeOpen && <StakeEternalBattle contractPriceFeed={contractPriceFeed} toggle={toggleJoinBattle} priceFeed={priceFeed} long={isLong} />}
		</>
	);
};

export default EternalBattleCard;
