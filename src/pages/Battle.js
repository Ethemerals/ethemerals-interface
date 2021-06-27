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

import useUserAccount from '../hooks/useUserAccount';

import EternalBattleCard from '../components/EternalBattleCard';

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
	const [gettingPrices, setGettingPrices] = useState(false);
	const [core, setCore] = useState({});
	const [ready, setReady] = useState(false);
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	useEffect(() => {
		getContracts();
	}, [provider]);

	useEffect(() => {
		if (prices) {
			console.log(prices);
		}
	}, [prices]);

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
