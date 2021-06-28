import { useState, useEffect } from 'react';

import { useWeb3, useAddress, useOnboard, useLogin, useContractCore, useContractToken, useReadyToTransact } from '../hooks/Web3Context';

import { Contract } from '@ethersproject/contracts';
import getSigner from '../constants/Signer';
import abis from '../constants/contracts/abis';
import Addresses from '../constants/contracts/Addresses';

import PriceFeeds from '../constants/PriceFeeds';

import EternalBattleCard from '../components/battle/EternalBattleCard';

const Battle = () => {
	const provider = useWeb3();

	// TODO do without provider

	const [contractPriceFeed, setContractPriceFeed] = useState(undefined);

	useEffect(() => {
		getContracts();
	}, [provider]);

	const getContracts = async () => {
		if (provider) {
			await setContractPriceFeed(new Contract(Addresses.priceFeed, abis.priceFeed, getSigner(provider)));
			console.log('GOT PRICEFEED CONTRACTS');
		} else {
		}
	};

	return (
		<>
			<h1>Battle</h1>
			<h2>Eternal Battle</h2>
			{contractPriceFeed && PriceFeeds && (
				<>
					<EternalBattleCard contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[0]} />
					<EternalBattleCard contractPriceFeed={contractPriceFeed} priceFeed={PriceFeeds[1]} />
				</>
			)}
		</>
	);
};

export default Battle;
