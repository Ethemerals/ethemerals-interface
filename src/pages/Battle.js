import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGQLQuery, useUniGQLQuery } from '../hooks/useGQLQuery';
import { GET_POOL } from '../queries/UniSubgraph';

import { shortenAddress, formatELF, formatETH } from '../utils';

import { BigNumber } from '@ethersproject/bignumber';

import { useWeb3, useAddress, useOnboard, useLogin, useContractCore, useContractToken, useReadyToTransact } from '../hooks/Web3Context';
// import { useContractBattle } from '../hooks/ContractBattleContext';
import { useSendTx } from '../hooks/TxContext';

import WaitingConfirmation from '../components/modals/WaitingConfirmation';
import ErrorDialogue from '../components/modals/ErrorDialogue';

import { Contract } from '@ethersproject/contracts';
import getSigner from '../constants/Signer';
import abis from '../constants/contracts/abis';
import Addresses from '../constants/contracts/Addresses';

import PriceFeeds from '../constants/PriceFeeds';

const Battle = () => {
	const provider = useWeb3();
	const address = useAddress();
	const onboard = useOnboard();
	const login = useLogin();
	const sendTx = useSendTx();
	const readyToTransact = useReadyToTransact();

	const [contractBattle, setContractBattle] = useState(undefined);
	const [contractPriceFeed, setContractPriceFeed] = useState(undefined);
	const [prices, setPrices] = useState({});
	const [core, setCore] = useState({});
	const [ready, setReady] = useState(false);
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	useEffect(() => {
		getContracts();
	}, [provider]);

	useEffect(() => {
		getPrices();
		return () => {
			getPrices();
		};
	}, [contractPriceFeed]);

	const getContracts = async () => {
		if (provider) {
			await setContractBattle(new Contract(Addresses.EternalBattle, abis.EternalBattle, getSigner(provider)));
			await setContractPriceFeed(new Contract(Addresses.priceFeed, abis.priceFeed, getSigner(provider)));
			console.log('GOT BATTLE CONTRACTS');
		} else {
		}
	};

	const getPrices = async () => {
		if (contractPriceFeed) {
			let newPrices = {};
			// btc usd
			newPrices[PriceFeeds[0].name] = (await contractPriceFeed.getPrice(0)).toString();
			setPrices(newPrices);
			console.log('getprice', newPrices);
		}
	};

	// const { data, status } = useUniGQLQuery('WBTC_USDC', GET_POOL, { id: WBTC_USDC });

	// const [ready, setReady] = useState(false);
	// const [WBTCUSDCPool, setWBTCUSDCPool] = useState(undefined);

	// useEffect(() => {
	// 	if (status === 'success' && data && data.pool) {
	// 		setWBTCUSDCPool(data.core);
	// 		setReady(true);
	// 	}
	// }, [status, data]);

	// useEffect(() => {
	// 	if (WBTCUSDCPool) {
	// 		console.log(WBTCUSDCPool);
	// 	}
	// }, [WBTCUSDCPool]);

	return (
		<div>
			<h1>Battle</h1>
			<h2>Eternal Battle</h2>
			<div className="w-420 h-64 bg-gray-700 p-4 m-4">
				<h3>Bitcoin vs USDC</h3>
				<button className="p-2 m-2 rounded bg-brandColor-purple">Join Bitcoin</button>
				<button className="p-2 m-2 rounded bg-brandColor-purple">Join USDC</button>
				<p>BTC/USDC</p>
				<p>Price: {prices && prices[PriceFeeds[0].name]}</p>
				<p>1hr percentage</p>
				<p>24h vol:</p>
			</div>
		</div>
	);
};

export default Battle;
