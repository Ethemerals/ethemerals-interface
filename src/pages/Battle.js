import { useState, useEffect } from 'react';

import { useWeb3, useAddress, useOnboard, useLogin, useContractToken, useReadyToTransact } from '../hooks/Web3Context';

import { Contract } from '@ethersproject/contracts';
import getSigner from '../constants/Signer';
import abis from '../constants/contracts/abis';
import Addresses from '../constants/contracts/Addresses';

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
