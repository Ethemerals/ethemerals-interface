import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import JoinEternalBattle from './modals/actions/JoinEternalBattle';

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

	const [baseName, setBaseName] = useState('');
	const [quoteName, setQuoteName] = useState('');
	const [ticker, setTicker] = useState('');
	const [price, setPrice] = useState(undefined);
	const [isLong, setIsLong] = useState(true);
	const [isJoinBattleOpen, setIsJoinBattleOpen] = useState(false);

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
		setIsJoinBattleOpen(!isJoinBattleOpen);
	};

	const handleJoinBattle = (long) => {
		toggleJoinBattle();
		setIsLong(long);
	};

	return (
		<>
			<div>
				<div className="w-420 h-64 bg-gray-700 p-4 m-4">
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

					<p>1hr percentage</p>
					<p>24h vol:</p>
				</div>
			</div>
			{isJoinBattleOpen && <JoinEternalBattle contractPriceFeed={contractPriceFeed} toggle={toggleJoinBattle} priceFeed={priceFeed} long={isLong} />}
		</>
	);
};

export default EternalBattleCard;
