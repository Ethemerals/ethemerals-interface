import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { usePriceFeedContract, usePriceFeedPrice } from '../hooks/usePriceFeed';

import PriceFeeds from '../constants/PriceFeeds';

import EternalBattleCard from '../components/battle/EternalBattleCard';
import EternalBattleCardOld from '../components/battle/EternalBattleCardOld';

const battleGraphic1 = 'https://ethemerals-media.s3.amazonaws.com/battlegraphic_1.png';

const priceFeed1 = {
	pair: 'ETH/USD',
	id: 0,
};
const BattleEternal = () => {
	const { contractPriceFeed } = usePriceFeedContract();
	const { price } = usePriceFeedPrice(contractPriceFeed, priceFeed1);

	useEffect(() => {
		console.log(price);
	}, [price]);

	return (
		<div className="scrollbar_pad">
			<div className="page_bg"></div>

			<div className="flex items-center mx-auto mt-2 sm:mt-10 text-sm sm:text-base justify-center">
				<button className={`bg-indigo-500 py-1 px-2 mx-1 rounded focus:outline-none`}>Eternal Battle</button>
				<button className={`bg-indigo-300 py-1 px-2 mx-1 rounded focus:outline-none cursor-default`}>Into The Wilds</button>
			</div>

			{/* <EternalBattleCard contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[0]} graphic={battleGraphic1} /> */}
			{/* <EternalBattleCardOld contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[1]} /> */}
			{/* <EternalBattleCardOld contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[2]} /> */}
			{/* <EternalBattleCardOld contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[3]} /> */}
		</div>
	);
};

export default BattleEternal;
