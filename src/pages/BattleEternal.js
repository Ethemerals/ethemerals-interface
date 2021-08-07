import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { usePriceFeedContract } from '../hooks/usePriceFeed';

import BattleMenu from '../components/navigation/BattleMenu';

import PriceFeeds from '../constants/PriceFeeds';

import EternalBattleCard from '../components/battle/EternalBattleCard';
import EternalBattleCardOld from '../components/battle/EternalBattleCardOld';
import HighestHonorBar from '../components/navigation/HighestHonorBar';

const battleGraphic1 = 'https://ethemerals-media.s3.amazonaws.com/battlegraphic_1.png';

const BattleEternal = () => {
	const { contractPriceFeed } = usePriceFeedContract();

	return (
		<div className="scrollbar_pad">
			<div className="page_bg"></div>

			<HighestHonorBar />
			<BattleMenu current="eternal" />

			<EternalBattleCard contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[0]} graphic={battleGraphic1} />
			<EternalBattleCardOld contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[1]} />
			<EternalBattleCardOld contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[2]} />
			<EternalBattleCardOld contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[3]} />
		</div>
	);
};

export default BattleEternal;
