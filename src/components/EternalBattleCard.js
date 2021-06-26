import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

const getPrice = async (contract, index) => {
	try {
		const price = await contract.getPrice(index);
		return price.toString();
	} catch (error) {
		throw new Error('error');
	}
};

const EternalBattleCard = ({ contract, priceFeed }) => {
	const { isLoading, isError, data } = useQuery([`priceFeed${priceFeed.id}`, priceFeed.id], () => getPrice(contract, priceFeed.id));

	const [baseName, setBaseName] = useState('');
	const [quoteName, setQuoteName] = useState('');
	const [ticker, setTicker] = useState('');
	const [price, setPrice] = useState(undefined);

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

	return (
		<div>
			<div className="w-420 h-64 bg-gray-700 p-4 m-4">
				<h3>
					{baseName} vs {quoteName}
				</h3>
				<button className="p-2 m-2 rounded bg-brandColor-purple">Join {baseName}</button>
				<button className="p-2 m-2 rounded bg-brandColor-purple">Join {quoteName}</button>
				<p>{ticker}</p>
				<p>Price: {price}</p>

				<p>1hr percentage</p>
				<p>24h vol:</p>
			</div>
		</div>
	);
};

export default EternalBattleCard;
