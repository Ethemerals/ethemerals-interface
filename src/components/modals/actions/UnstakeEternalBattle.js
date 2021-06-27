import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Range, getTrackBackground } from 'react-range';
import { useQuery } from 'react-query';
import { Contract } from '@ethersproject/contracts';

import abis from '../../../constants/contracts/abis';
import Addresses from '../../../constants/contracts/Addresses';
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

const UnstakeEternalBattle = ({ contractPriceFeed, toggle, priceFeed, nft }) => {
	const long = true; // TODO
	const { isLoading, isError, data } = useQuery([`priceFeed${priceFeed.id}`, priceFeed.id], () => getPrice(contractPriceFeed, priceFeed.id));
	const { account } = useUserAccount();

	const provider = useWeb3();
	const sendTx = useSendTx();
	const readyToTransact = useReadyToTransact();

	const [isOwned, setIsOwned] = useState(false);

	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const [contractBattle, setContractBattle] = useState(undefined);
	const [price, setPrice] = useState(undefined);
	const [allyName, setAllyName] = useState('');
	const [enemyName, setEnemyName] = useState('');
	const [ticker, setTicker] = useState('');

	useEffect(() => {
		if (account) {
			if (nft.previousOwner.id === account.id) {
				setIsOwned(true);
			}
		}
	}, [account]);

	useEffect(() => {
		if (priceFeed) {
			setAllyName(long ? priceFeed.baseName : priceFeed.quoteName);
			setEnemyName(long ? priceFeed.quoteName : priceFeed.baseName);
			setTicker(priceFeed.name);
		}
	}, [priceFeed, long]);

	useEffect(() => {
		getContracts();
	}, [provider]);

	const getContracts = async () => {
		if (provider) {
			await setContractBattle(new Contract(Addresses.EternalBattle, abis.EternalBattle, getSigner(provider)));
			console.log('GOT BATTLE CONTRACTS');
		} else {
		}
	};

	useEffect(() => {
		if (!isLoading) {
			setPrice(data);
		}
	}, [data, isLoading]);

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
				const gasLimit = gasEstimate.add(gasEstimate.div(9));
				const tx = await contractBattle.cancelStake(id, { gasLimit });
				console.log(tx);
				sendTx(tx.hash, 'Return from Battle', true, `nft_${id}`);
				// TODO INVALIDATE
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
						{nft && (
							<>
								<p className="">{`You are about to leave ${nft.metadata.coin} to join ${allyName}'s Eternal Battle against ${enemyName}!`}</p>
								<p>{`${nft.metadata.coin}'s current Honor Points: ${nft.score}`}</p>
							</>
						)}

						{isOwned && (
							<button onClick={onSubmitUnStake} className="bg-brandColor text-xl text-bold px-4 py-2 m-2 rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300">
								Leave the Battle
							</button>
						)}
					</div>
				</div>
			</div>
			{isConfirmationOpen && <WaitingConfirmation toggle={toggleConfirmation} message={`Retrieve ${nft.metadata.coin} from Battle`} />}
			{isErrorOpen && <ErrorDialogue toggle={toggleError} message={errorMsg} />}
		</>
	);
};

export default UnstakeEternalBattle;
