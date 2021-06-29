import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Range, getTrackBackground } from 'react-range';
import { useQuery } from 'react-query';
import { Contract } from '@ethersproject/contracts';

import abis from '../../../constants/contracts/abis';
import Addresses from '../../../constants/contracts/Addresses';
import FunctionTx from '../../../constants/FunctionTx';
import getSigner from '../../../constants/Signer';
import { useSendTx } from '../../../hooks/TxContext';
import { useWeb3, useAddress, useOnboard, useLogin, useContractCore, useContractToken, useReadyToTransact } from '../../../hooks/Web3Context';

import useUserAccount from '../../../hooks/useUserAccount';
import WaitingConfirmation from '../WaitingConfirmation';
import ErrorDialogue from '../ErrorDialogue';

const getPrice = async (contract, index) => {
	try {
		const price = await contract.getPrice(index);
		return price.toString();
	} catch (error) {
		throw new Error('error');
	}
};

const getChange = async (contract, id) => {
	if (contract) {
		try {
			const value = await contract.getChange(id);

			return parseInt(value[0]) * (value[1] ? 1 : -1);
		} catch (error) {
			throw new Error('error');
		}
	} else {
		// connect
		console.log('no wallet');
		throw new Error('error');
	}
};

const NFTComputedScore = ({ contract, nft, scoreChange, setScoreChange }) => {
	const { isLoading, isError, data } = useQuery([`getChange_${nft.id}`, nft.id], () => getChange(contract, nft.id));

	useEffect(() => {
		if (!isLoading) {
			if (data) {
				setScoreChange(data);
			}
		}
	}, [data, isLoading]);

	if (isLoading) {
		return <p>Loading</p>;
	}

	return (
		<>
			<p>
				{`${nft.metadata.coin}'s current Honor Points: ${parseInt(nft.score) + scoreChange}`}
				<span className="text-xs"> {`(${scoreChange < 0 ? '' : '+'}${scoreChange})`}</span>
			</p>
		</>
	);
};

const EternalBattleStatus = ({ contractPriceFeed, toggle, priceFeed, nft, isOwned }) => {
	const { isLoading, isError, data } = useQuery([`priceFeed${priceFeed.id}`, priceFeed.id], () => getPrice(contractPriceFeed, priceFeed.id));

	const provider = useWeb3();
	const sendTx = useSendTx();
	const readyToTransact = useReadyToTransact();

	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const [contractBattle, setContractBattle] = useState(undefined);
	const [price, setPrice] = useState(undefined);
	const [allyName, setAllyName] = useState('');
	const [enemyName, setEnemyName] = useState('');
	const [ticker, setTicker] = useState('');

	const [scoreChange, setScoreChange] = useState(undefined);
	const [marginCall, setMarginCall] = useState(false);

	useEffect(() => {
		if (priceFeed) {
			setAllyName(nft.actions[0].long ? priceFeed.baseName : priceFeed.quoteName);
			setEnemyName(nft.actions[0].long ? priceFeed.quoteName : priceFeed.baseName);
			setTicker(priceFeed.name);
		}
	}, [priceFeed, nft]);

	useEffect(() => {
		getContracts();
	}, [provider]);

	useEffect(() => {
		if (!isLoading) {
			setPrice(data);
		}
	}, [data, isLoading]);

	useEffect(() => {
		if (nft && scoreChange) {
			if (parseInt(nft.score) + scoreChange < 18) {
				setMarginCall(true);
			} else {
				setMarginCall(false);
			}
		}
	}, [scoreChange, nft]);

	const getContracts = async () => {
		if (provider) {
			await setContractBattle(new Contract(Addresses.EternalBattle, abis.EternalBattle, getSigner(provider)));
			console.log('GOT BATTLE CONTRACTS');
		} else {
		}
	};

	const toggleConfirmation = () => {
		setIsConfirmationOpen(!isConfirmationOpen);
	};

	const toggleError = () => {
		setIsErrorOpen(!isErrorOpen);
	};

	const onSubmitUnStake = async () => {
		if (contractBattle && readyToTransact()) {
			setIsConfirmationOpen(true);

			try {
				let id = nft.id;
				const gasEstimate = await contractBattle.estimateGas.cancelStake(id);
				const gasLimit = gasEstimate.add(gasEstimate.div(FunctionTx.cancelStake.gasDiv));
				const tx = await contractBattle.cancelStake(id, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, FunctionTx.cancelStake.receiptMsg, true, [`nft_${id}`, 'account_eternalBattle', 'account', 'core']);
			} catch (error) {
				setIsErrorOpen(true);
				setErrorMsg('Transfer transaction rejected from user wallet');
				console.log(`${error.data} \n${error.message}`);
			}
			setIsConfirmationOpen(false);
			toggle();
		} else {
			// connect
			console.log('no wallet');
		}
	};

	return (
		<>
			<div className="w-full h-full flex justify-center fixed top-0 left-0">
				<div onClick={toggle} className="fixed w-full h-full top-0 left-0 z-20 bg-opacity-50 bg-black"></div>
				<div className=" w-11/12 max-w-420 h-96 center border-gray-400 bg-opacity-100 rounded-2xl overflow-hidden z-30 tracking-wide shadow-xl bg-gray-900">
					<div className="flex justify-end">
						<span onClick={toggle} className="cursor-pointer px-4 py-2 text-gray-300 hover:text-gray-100">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
								<path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
							</svg>
						</span>
					</div>
					<div className="text-center px-2">
						<p className="text-2xl">{ticker}</p>
						{price !== undefined && (
							<p className="text-sm font-light">
								current price: {price} {priceFeed.quoteSymbol}
							</p>
						)}
						<p className="my-4">{`${nft.metadata.coin} is allied with ${allyName}, on her Eternal Battle against ${enemyName}!`}</p>

						{contractBattle && <NFTComputedScore contract={contractBattle} nft={nft} scoreChange={scoreChange} setScoreChange={setScoreChange} />}

						{isOwned && (
							<button onClick={onSubmitUnStake} className="bg-brandColor text-xl text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
								Leave the Battle
							</button>
						)}

						{!isOwned && (
							<>
								<button
									disabled={!marginCall}
									className={`text-xl text-bold px-4 py-2 m-2 rounded-lg shadow-lg bg-brandColor ${!marginCall ? 'opacity-50 cursor-default' : 'hover:bg-yellow-400 transition duration-300'}  `}
								>
									Revive
								</button>
								<button
									disabled={!marginCall}
									className={`text-xl text-bold px-4 py-2 m-2 rounded-lg shadow-lg bg-brandColor ${!marginCall ? 'opacity-50 cursor-default' : 'hover:bg-yellow-400 transition duration-300'}  `}
								>
									Reap
								</button>
							</>
						)}
					</div>
				</div>
			</div>
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message={`Retrieve ${nft.metadata.coin} from Battle`} />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</>
	);
};

export default EternalBattleStatus;
