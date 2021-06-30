import { usePriceFeedContract } from '../hooks/usePriceFeed';

import PriceFeeds from '../constants/PriceFeeds';

import EternalBattleCard from '../components/battle/EternalBattleCard';

const Battle = () => {
	const { contractPriceFeed } = usePriceFeedContract();

	// TODO do without provider

	return (
		<>
			<h1>Battle</h1>
			<h2>Eternal Battle</h2>

			<EternalBattleCard contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[0]} />
			<EternalBattleCard contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[1]} />
			<EternalBattleCard contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[2]} />
			<EternalBattleCard contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[3]} />
		</>
	);
};

export default Battle;
