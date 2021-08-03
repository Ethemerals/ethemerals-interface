import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { usePriceFeedContract } from '../hooks/usePriceFeed';

import BattleMenu from '../components/navigation/BattleMenu';

import PriceFeeds from '../constants/PriceFeeds';

import EternalBattleCard from '../components/battle/EternalBattleCard';
import HighestHonorBar from '../components/navigation/HighestHonorBar';

const BattleEternal = () => {
	const { contractPriceFeed } = usePriceFeedContract();

	return (
		<div className="scrollbar_pad">
			<div className="page_bg"></div>
			<BattleMenu current="eternal" />
			<HighestHonorBar />

			<EternalBattleCard contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[0]} />
			<EternalBattleCard contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[1]} />
			<EternalBattleCard contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[2]} />
			<EternalBattleCard contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[3]} />
		</div>
	);
};

export default BattleEternal;
